"use server";

import { db } from "@mapform/db";
import { count, eq, inArray } from "@mapform/db/utils";
import { revalidatePath } from "next/cache";
import {
  cells,
  columns,
  pages,
  projects,
  type Column,
} from "@mapform/db/schema";
import type {
  CustomBlock,
  DocumentContent,
  InputCustomBlockTypes,
} from "@mapform/blocknote";
import { authAction } from "~/lib/safe-action";
import { updatePageSchema } from "./schema";

const mapBlockTypeToDataType = (
  blockType: InputCustomBlockTypes
): Column["type"] => {
  switch (blockType) {
    case "textInput":
      return "string";
    case "pin":
      return "point";
    default:
      return "string";
  }
};

const flattenBlockNoteContent = (
  content: DocumentContent,
  flatBlocks: CustomBlock[] = []
) => {
  for (const block of content) {
    flatBlocks.push(block);

    if (block.children.length) {
      flattenBlockNoteContent(block.children, flatBlocks);
    }
  }

  return flatBlocks;
};

export const updatePage = authAction
  .schema(updatePageSchema)
  .action(
    async ({
      parsedInput: {
        id,
        title,
        content,
        zoom,
        pitch,
        bearing,
        center,
        contentViewType,
      },
    }) => {
      const insertContent = content as unknown as { content: DocumentContent };

      const page = await db.query.pages.findFirst({
        where: eq(pages.id, id),
        columns: {
          id: true,
        },
        with: {
          project: {
            columns: {
              id: true,
            },
            with: {
              submissionsDataset: {
                columns: {
                  id: true,
                },
              },
              teamspace: {
                columns: {
                  id: true,
                },
                with: {
                  workspace: {
                    columns: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!page) {
        throw new Error("Page not found");
      }

      const datasetColumns = await db
        .select({
          columnId: columns.id,
          blockNoteId: columns.blockNoteId,
          cellCount: count(cells.id),
        })
        .from(columns)
        .leftJoin(cells, eq(cells.columnId, columns.id))
        .groupBy(columns.id)
        .where(eq(columns.pageId, id));

      const documentContent = (content?.content ?? []) as CustomBlock[];

      const stepBlocks = flattenBlockNoteContent(documentContent)
        .map((block) => {
          if (block.type === "pin" || block.type === "textInput") {
            return block;
          }

          return undefined;
        })
        .filter((block) => {
          return block !== undefined;
        });

      const inputBlocksToCreate = stepBlocks
        .filter((block) => {
          return !datasetColumns.find((col) => col.blockNoteId === block.id);
        })
        .map((block) => ({
          name: `${mapBlockTypeToDataType(block.type)}-${block.id}`,
          type: mapBlockTypeToDataType(block.type),
          blockNoteId: block.id,
          datasetId: page.project.submissionsDataset.id,
          pageId: id,
        }));

      // Delete blocks which are not present in the new content, and which have no cells (submissions)
      const inputBlocksToDelete = datasetColumns.filter((col) => {
        return (
          !stepBlocks.find((block) => block.id === col.blockNoteId) &&
          col.cellCount === 0
        );
      });

      await db.transaction(async (tx) => {
        await Promise.all([
          tx
            .update(pages)
            .set({
              zoom,
              title,
              pitch,
              center,
              bearing,
              contentViewType,
              content: insertContent,
            })
            .where(eq(pages.id, id)),

          tx
            .update(projects)
            .set({ isDirty: true })
            .where(eq(projects.id, page.project.id)),

          inputBlocksToCreate.length &&
            tx.insert(columns).values(inputBlocksToCreate),

          tx.delete(columns).where(
            inArray(
              columns.id,
              inputBlocksToDelete.map((col) => col.columnId)
            )
          ),
        ]);
      });

      revalidatePath(
        `/${page.project.teamspace.workspace.id}/${page.project.teamspace.id}/projects/${page.project.id}`
      );
    }
  );
