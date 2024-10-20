"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { columns, datasets } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { createEmptyDatasetSchema } from "./schema";

export const createEmptyDataset = authAction
  .schema(createEmptyDatasetSchema)
  .action(async ({ parsedInput: { name, layerType, teamspaceId } }) => {
    // We collect the layerType so that we can create columns for the intended layer

    const dataset = await db.transaction(async (tx) => {
      const [ds] = await tx
        .insert(datasets)
        .values({
          name,
          teamspaceId,
        })
        .returning();

      if (layerType === "point" && dataset) {
        await tx.insert(columns).values([
          {
            datasetId: dataset.id,
            name: "Location",
            type: "point",
          },
          {
            datasetId: dataset.id,
            name: "Title",
            type: "string",
          },
          {
            datasetId: dataset.id,
            name: "Description",
            type: "richtext",
          },
        ]);
      }

      return ds;
    });

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return dataset;
  });
