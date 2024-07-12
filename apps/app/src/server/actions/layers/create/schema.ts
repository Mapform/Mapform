"use server";

import { LayerType } from "@mapform/db";
import { z } from "zod";

export const createLayerSchema = z.object({
  name: z.string().optional(),
  type: z.enum([LayerType.POINT]),
  dataTrackId: z.string(),
  dataSetId: z.string(),
});

export type CreateLayerSchema = z.infer<typeof createLayerSchema>;
