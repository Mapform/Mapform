"use server";

import { revalidatePath } from "next/cache";
import { db } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { createLayer } from "~/data/layers/create-layer";
import { createDatasetFromGeojson } from "~/data/datasets/create-from-geojson";
import { quickCreateDataLayerSchema } from "./schema";

export const quickCreateDataLayer = authAction
  .schema(quickCreateDataLayerSchema)
  .action(async ({ parsedInput: { name, formId, stepId, data } }) => {
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    const datasetResponse = await createDatasetFromGeojson({
      name,
      workspaceId: form.workspaceId,
      data,
    });

    const dataset = datasetResponse?.data;

    if (!dataset) {
      throw new Error("Dataset not found");
    }

    const geoCol = dataset.columns.find(
      (column) => column.dataType === "POINT"
    );

    await createLayer({
      name,
      type: "POINT",
      formId,
      stepId,
      pointColumnId: geoCol?.id,
      datasetId: dataset.id,
    });

    revalidatePath("/");
  });
