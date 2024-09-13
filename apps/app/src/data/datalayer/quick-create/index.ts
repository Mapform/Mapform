"use server";

import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { createLayer } from "~/data/layers/create";
import { createDataset } from "~/data/datasets/create";
import { quickCreateDataLayerSchema } from "./schema";
import { revalidatePath } from "next/cache";

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

    const datasetResponse = await createDataset({
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
