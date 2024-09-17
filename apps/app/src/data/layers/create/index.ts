"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createLayerSchema } from "./schema";

export const createLayer = authAction
  .schema(createLayerSchema)
  .action(
    async ({
      parsedInput: { name, type, formId, stepId, datasetId, pointColumnId },
    }) => {
      const layer = await prisma.$transaction(async (tx) => {
        const newLayer = await tx.layer.create({
          data: {
            name,
            type,
            formId,
            datasetId,
            steps: {
              connect: {
                id: stepId,
              },
            },
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- This error will go away once I add more types
            ...(type === "POINT" &&
              pointColumnId && {
                pointLayer: {
                  create: {
                    pointColumnId,
                  },
                },
              }),
          },
        });

        await tx.step.update({
          where: {
            id: stepId,
          },
          data: {
            layerOrder: {
              push: newLayer.id,
            },
          },
        });

        return newLayer;
      });

      revalidatePath("/");

      return layer;
    }
  );
