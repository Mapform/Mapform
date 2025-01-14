"server-only";

import { db } from "@mapform/db";
import { count, eq, inArray, type SQL, sql } from "@mapform/db/utils";
import {
  cells,
  columns,
  pages,
  projects,
  type Column,
} from "@mapform/db/schema";
import {
  type CustomBlock,
  type DocumentContent,
  type InputCustomBlockTypes,
} from "@mapform/blocknote";
import { updatePageSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

const mapBlockTypeToDataType = (
  blockType: InputCustomBlockTypes,
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
  flatBlocks: CustomBlock[] = [],
) => {
  for (const block of content) {
    flatBlocks.push(block);

    if (block.children.length) {
      flattenBlockNoteContent(block.children, flatBlocks);
    }
  }

  return flatBlocks;
};

export const updatePage = (authClient: UserAuthClient) =>
  authClient
    .schema(updatePageSchema)
    .action(
      async ({
        parsedInput: {
          id,
          icon,
          title,
          content,
          zoom,
          pitch,
          bearing,
          center,
          contentViewType,
        },
      }) => {
        const insertContent = content as unknown as {
          content: DocumentContent;
        };

        const page = await db.query.pages.findFirst({
          where: eq(pages.id, id),
          columns: {
            id: true,
            pageType: true,
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

        if (
          page.pageType === "page_ending" &&
          insertContent.content.some(
            (block) => block.type === "pin" || block.type === "textInput",
          )
        ) {
          throw new Error("Page ending cannot have input blocks");
        }

        const datasetColumns = await db
          .select({
            name: columns.name,
            columnId: columns.id,
            blockNoteId: columns.blockNoteId,
            cellCount: count(cells.id),
          })
          .from(columns)
          .leftJoin(cells, eq(cells.columnId, columns.id))
          .groupBy(columns.id)
          .where(eq(columns.pageId, id));

        const documentContent = (content?.content ?? []) as CustomBlock[];

        const pageBlock = flattenBlockNoteContent(documentContent)
          .map((block) => {
            if (block.type === "pin" || block.type === "textInput") {
              return block;
            }

            return undefined;
          })
          .filter((block) => {
            return block !== undefined;
          });

        const inputBlocksToCreate = page.project.submissionsDataset
          ? pageBlock
              .filter((block) => {
                return !datasetColumns.find(
                  (col) => col.blockNoteId === block.id,
                );
              })
              .map((block) => ({
                name: block.props.label,
                type: mapBlockTypeToDataType(block.type),
                blockNoteId: block.id,
                datasetId: page.project.submissionsDataset!.id,
                pageId: id,
              }))
          : [];

        // Delete blocks which are not present in the new content, and which have no cells (submissions)
        const inputBlocksToDelete = datasetColumns.filter((col) => {
          return (
            !pageBlock.find((block) => block.id === col.blockNoteId) &&
            col.cellCount === 0
          );
        });

        // Input blocks to update
        const inputBlocksToUpdate = pageBlock
          .filter((block) => {
            return datasetColumns.find((col) => {
              return (
                col.blockNoteId === block.id && col.name !== block.props.label
              );
            });
          })
          .map((block) => ({
            name: block.props.label,
            blockNoteId: block.id,
          }));

        // To update many columns at once, we need to use a case statement as per: https://orm.drizzle.team/docs/guides/update-many-with-different-value
        const sqlChunks: SQL[] = [];
        sqlChunks.push(sql`(case`);
        for (const input of inputBlocksToUpdate) {
          sqlChunks.push(
            sql`when ${columns.blockNoteId} = ${input.blockNoteId} then ${input.name}`,
          );
        }
        sqlChunks.push(sql`end)`);
        const updateBlocksSql: SQL = sql.join(sqlChunks, sql.raw(" "));

        await db.transaction(async (tx) => {
          await Promise.all([
            tx
              .update(pages)
              .set({
                zoom,
                icon,
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
                inputBlocksToDelete.map((col) => col.columnId),
              ),
            ),

            inputBlocksToUpdate.length &&
              tx
                .update(columns)
                .set({
                  name: updateBlocksSql,
                })
                .where(
                  inArray(
                    columns.blockNoteId,
                    inputBlocksToUpdate.map((col) => col.blockNoteId),
                  ),
                ),
          ]);
        });

        return page;
      },
    );
