import { z } from "zod";

export const getLayerPointSchema = z.object({
  rowId: z.string(),
  pointLayerId: z.string(),
});

export type GetLayerPointSchema = z.infer<typeof getLayerPointSchema>;
