import { z } from "zod";
import { zu } from "@infra-blocks/zod-utils";
import { insertDatasetSchema } from "@mapform/db/schema";

export const createDatasetFromGeojsonSchema = z.object({
  name: insertDatasetSchema.shape.name,
  teamspaceId: insertDatasetSchema.shape.teamspaceId,
  // This leads to TS complexity errors
  data: zu.geojson() as any,
});

export type CreateDatasetFromGeojsonSchema = z.infer<
  typeof createDatasetFromGeojsonSchema
>;
