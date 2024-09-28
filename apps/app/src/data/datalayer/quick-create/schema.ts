import { z } from "zod";
import {
  insertDatasetSchema,
  insertLayersToPagesSchema,
} from "@mapform/db/schema";
import { zu } from "@infra-blocks/zod-utils";

export const quickCreateDataLayerSchema = z.object({
  name: insertDatasetSchema.shape.name,
  pageId: insertLayersToPagesSchema.shape.pageId,
  data: zu.geojson() as any,
});

export type QuickCreateDataLayerSchema = z.infer<
  typeof quickCreateDataLayerSchema
>;
