import { z } from "zod";

export const createLayerSchema = z.object({
  name: z.string().optional(),
  type: z.enum(["POINT"]),
  dataTrackId: z.string(),
  datasetId: z.string(),
  pointColumnId: z.string().optional(),
});

export type CreateLayerSchema = z.infer<typeof createLayerSchema>;
