"use server";

import { LayerType } from "@mapform/db";
import { z } from "zod";

export const createLayerSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(LayerType),
  dataTrackId: z.string(),
  dataSetId: z.string(),
});

export type CreateLayerSchema = z.infer<typeof createLayerSchema>;
