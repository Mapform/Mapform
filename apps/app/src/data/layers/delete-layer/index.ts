"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { deleteLayerSchema } from "./schema";

export const deleteLayer = authAction
  .schema(deleteLayerSchema)
  .action(async ({ parsedInput: { layerId }, ctx: { userId } }) => {
    const userLayer = await prisma.layer.findUnique({
      where: {
        id: layerId,
        form: {
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
      },
      select: {
        formId: true,
        steps: {
          select: {
            id: true,
            formId: true,
            layerOrder: true,
          },
        },
      },
    });

    if (!userLayer?.formId) {
      throw new Error("Layer could not be found.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.layer.update({
        where: {
          id: layerId,
        },
        data: {
          steps: {
            update: userLayer.steps.map((step) => ({
              where: {
                id: step.id,
              },
              data: {
                layerOrder: {
                  set: step.layerOrder.filter((id) => id !== layerId),
                },
              },
            })),
          },
        },
      });

      await tx.layer.delete({
        where: {
          id: layerId,
        },
      });
    });

    const form = await prisma.form.update({
      where: {
        id: userLayer.formId,
      },
      data: {
        isDirty: true,
      },
      include: {
        workspace: {
          include: {
            organization: true,
          },
        },
      },
    });

    revalidatePath(
      `/orgs/${form.workspace.organization.slug}/workspaces/${form.workspace.slug}/forms/${userLayer.formId}`
    );
  });
