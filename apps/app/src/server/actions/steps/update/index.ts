"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { updateStepSchema } from "./schema";

const mapBlockTypeToDataType = (blockType) => {
  switch (blockType) {
    case "textInput":
      return "STRING";
    case "pin":
      return "POINT";
    default:
      return "STRING";
  }
};

export const updateStep = authAction
  .schema(updateStepSchema)
  .action(async ({ parsedInput: { stepId, data }, ctx: { orgId } }) => {
    if (!data.formId) {
      throw new Error("Form ID is required.");
    }

    const userForm = await prisma.form.findUnique({
      where: {
        id: data.formId,
        workspace: {
          organizationId: orgId,
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

    const step = await prisma.step.findUnique({
      where: {
        id: stepId,
      },
      select: {
        id: true,
        description: true,
      },
    });

    if (!userForm) {
      throw new Error("User does not have access to this organization.");
    }

    // TODO: Need to do this recursively
    const stepBlocks =
      data.description?.content
        .flatMap((block) => {
          if (block.type === "pin" || block.type === "textInput") {
            return block;
          }

          return undefined;
        })
        .filter((block) => {
          return block !== undefined;
        }) ?? [];

    const inputBlocksToCreate =
      stepBlocks.filter((block) => {
        return !userForm.dataset?.columns.find(
          (col) => col.blockNoteId === block.id
        );
      }) ?? [];

    // Delete blocks which are not present in the new description, and which have no cells (submissions)
    const inputBlocksToDelete = userForm.dataset?.columns.filter((col) => {
      return (
        !stepBlocks.find((block) => block.id === col.blockNoteId) &&
        col._count.cellValues === 0
      );
    });

    await prisma.$transaction(async (tx) => {
      await tx.step.update({
        where: {
          id: stepId,
        },
        // @ts-expect-error -- This is a valid update
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
            datasetId: userForm.dataset?.id,
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
