"use server";

import { revalidatePath } from "next/cache";
import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { pages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { createLayer } from "~/data/layers/upsert-layer";
import { createDatasetFromGeojson } from "~/data/datasets/create-from-geojson";
import { quickCreateDataLayerSchema } from "./schema";

export const quickCreateDataLayer = authAction
  .schema(quickCreateDataLayerSchema)
  .action(async ({ parsedInput: { name, pageId, data } }) => {
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, pageId),
      with: {
        project: true,
      },
    });

    if (!page) {
      throw new Error("Page not found");
    }

    const datasetResponse = await createDatasetFromGeojson({
      name,
      teamspaceId: page.project.teamspaceId,
      data,
    });

    const dataset = datasetResponse?.data;

    if (!dataset) {
      throw new Error("Dataset not found");
    }

    const geoCol = dataset.columns.find((column) => column.type === "point");

    await createLayer({
      name,
      type: "point",
      pageId,
      pointColumnId: geoCol?.id,
      datasetId: dataset.dataset.id,
    });

    revalidatePath("/");
  });
