"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { createLayer } from "~/data/layers/create";
import { createDatasetFromCSV } from "~/data/datasets/create-from-csv";
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

    const datasetResponse = await createDatasetFromCSV({
      name,
      workspaceId: form.workspaceId,
      data,
    });

    const dataset = datasetResponse?.data;

    if (!dataset) {
      throw new Error("Dataset not found");
    }

    const pointCol = dataset.columns.find(
      (column) => column.dataType === "POINT"
    );

    await createLayer({
      name,
      type: "POINT",
      formId,
      stepId,
      pointColumnId: pointCol?.id,
      datasetId: dataset.id,
    });

    revalidatePath("/");
  });
