"use server";

import { createDatasetFromGeojson } from "@mapform/backend/datasets/create-from-geojson";
import { createDatasetFromGeojsonSchema } from "@mapform/backend/datasets/create-from-geojson/schema";
import { authAction } from "~/lib/safe-action";

export const createDatasetFromGeojsonAction = authAction
  .schema(createDatasetFromGeojsonSchema)
  .action(async ({ parsedInput }) => createDatasetFromGeojson(parsedInput));
