import { db } from "@mapform/db";
import { columns, datasets } from "@mapform/db/schema";
import type { CreateEmptyDatasetSchema } from "./schema";

export const createEmptyDataset = async ({
  name,
  layerType,
  teamspaceId,
}: CreateEmptyDatasetSchema) => {
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

  return {
    dataset: response.ds,
    columns: response.cols,
  };
};
