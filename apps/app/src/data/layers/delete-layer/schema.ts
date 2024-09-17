import { z } from "zod";

export const deleteLayerSchema = z.object({
  layerId: z.string(),
});

export type DeleteLayerSchema = z.infer<typeof deleteLayerSchema>;
