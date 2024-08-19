"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import type {
  CustomBlock,
  DocumentContent,
  InputCustomBlockTypes,
} from "@mapform/blocknote";
import { authAction } from "~/lib/safe-action";
import { updateStepSchema } from "./schema";

const mapBlockTypeToDataType = (blockType: InputCustomBlockTypes) => {
  switch (blockType) {
    case "textInput":
      return "STRING";
    case "pin":
      return "POINT";
    default:
      return "STRING";
  }
};

// Recursive function to flatten block note content
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

export const updateStep = authAction
  .schema(updateStepSchema)
  .action(async ({ parsedInput: { stepId, data }, ctx: { userId } }) => {
    if (!data.formId) {
      throw new Error("Form ID is required.");
    }

    // TODO: Data validation -> Need to check at runtime that data follows valid
    // Blocknote schema. Can write a custiom zod schema for this, or check back
    // with BlockNote to see if they've added this functionality.
    const documentContent =
      (
        data.description as
          | {
              content: DocumentContent;
            }
          | undefined
      )?.content ?? [];

    const userForm = await prisma.form.findUnique({
      where: {
        id: data.formId,
        workspace: {
          organization: {
            members: {
              some: {
                userId,
              },
            },
          },
        },
      },
      include: {
        dataset: {
          include: {
            columns: {
              include: {
                _count: {
                  select: {
                    cellValues: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userForm) {
      throw new Error("User does not have access to this organization.");
    }

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

    const inputBlocksToCreate = stepBlocks.filter((block) => {
      return !userForm.dataset?.columns.find(
        (col) => col.blockNoteId === block.id
      );
    });

    // Delete blocks which are not present in the new description, and which have no cells (submissions)
    const inputBlocksToDelete = userForm.dataset?.columns.filter((col) => {
      return (
        !stepBlocks.find((block) => block.id === col.blockNoteId) &&
        col._count.cellValues === 0
      );
    });

    await prisma.$transaction(async (tx) => {
      console.log(11111, data);

      await tx.step.update({
        where: {
          id: stepId,
        },
        data,
      });

      await tx.form.update({
        where: {
          id: data.formId,
        },
        data: {
          isDirty: true,
        },
      });

      await tx.column.createMany({
        data: inputBlocksToCreate.map((block) => {
          return {
            name: block.id,
            dataType: mapBlockTypeToDataType(block.type),
            blockNoteId: block.id,
            datasetId: userForm.dataset!.id,
          };
        }),
      });

      await tx.column.deleteMany({
        where: {
          id: {
            in: inputBlocksToDelete?.map((block) => block.id) ?? [],
          },
        },
      });
    });

    revalidatePath("/");
  });
