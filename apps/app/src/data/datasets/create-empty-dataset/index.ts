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

    const response = await db.transaction(async (tx) => {
      let cols;
      const [ds] = await tx
        .insert(datasets)
        .values({
          name,
          teamspaceId,
        })
        .returning();

      if (layerType === "point" && ds) {
        cols = await tx
          .insert(columns)
          .values([
            {
              datasetId: ds.id,
              name: "Location",
              type: "point",
            },
            {
              datasetId: ds.id,
              name: "Title",
              type: "string",
            },
            {
              datasetId: ds.id,
              name: "Description",
              type: "richtext",
            },
          ])
          .returning();
      }

      return {
        ds,
        cols,
      };
    });

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return {
      dataset: response.ds,
      columns: response.cols,
    };
  });
