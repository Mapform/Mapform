import { z } from "zod";
import { zu } from "@infra-blocks/zod-utils";

export const quickCreateDataLayerSchema = z.object({
  name: z.string(),
  type: z.enum(["POINT"]),
  stepId: z.string(),
  formId: z.string(),
  data: zu.geojson(),
});

export type QuickCreateDataLayerSchema = z.infer<
  typeof quickCreateDataLayerSchema
>;
