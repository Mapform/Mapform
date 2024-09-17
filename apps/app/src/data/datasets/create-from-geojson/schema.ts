import { z } from "zod";
import { zu } from "@infra-blocks/zod-utils";

export const createDatasetFromGeojsonSchema = z.object({
  name: z.string().min(3),
  workspaceId: z.string(),
  data: zu.geojson(),
});

export type CreateDatasetFromGeojsonSchema = z.infer<
  typeof createDatasetFromGeojsonSchema
>;
