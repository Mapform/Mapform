import { z } from "zod";

export const quickCreateDataLayerSchema = z.object({
  name: z.string(),
  type: z.enum(["POINT"]),
  stepId: z.string(),
  formId: z.string(),
  data: z.array(z.record(z.string(), z.string())),
});

export type QuickCreateDataLayerSchema = z.infer<
  typeof quickCreateDataLayerSchema
>;
