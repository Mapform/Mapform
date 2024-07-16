"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createLayerSchema } from "./schema";

export const createLayerAction = authAction
  .schema(createLayerSchema)
  .action(
    async ({
      parsedInput: { name, type, datasetId, dataTrackId, pointColumnId },
    }) => {
      await prisma.layer.create({
        data: {
          type,
          name,
          datasetId,
          dataTrackId,
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
