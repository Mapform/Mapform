"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createLayerSchema } from "./schema";

export const createLayerAction = authAction
  .schema(createLayerSchema)
  .action(
    async ({
      parsedInput: { name, type, formId, stepId, datasetId, pointColumnId },
    }) => {
      await prisma.layer.create({
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

      revalidatePath("/forms/");
    }
  );
