"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { updateStepSchema } from "./schema";

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

    if (!userForm) {
      throw new Error("User does not have access to this organization.");
    }

    const inputBlocksToCreate =
      data.description?.content
        .flatMap((block) => {
          if (block.type === "pin" || block.type === "textInput") {
            return block;
          }

          return undefined;
        })
        .filter((block) => {
          return (
            block !== undefined &&
            !userForm.dataset?.columns.find((col) => col.name === block.id)
          );
        }) ?? [];

    console.log(11111, inputBlocksToCreate);

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
            // TODO: Make this dynamic
            dataType: "POINT",
            datasetId: userForm.dataset?.id,
          };
        }),
      });
    });

    revalidatePath("/");
  });
