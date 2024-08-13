import { z } from "zod";
import type { DataTrack } from "@mapform/db";

export const createDataTrackSchema = z.object({
  formId: z.string(),
  startStepIndex: z.number(),
  endStepIndex: z.number(),
  layerIndex: z.number(),
} as TypeToZod<
  Pick<DataTrack, "formId" | "startStepIndex" | "endStepIndex" | "layerIndex">
>);
export type CreateDataTrackSchema = z.infer<typeof createDataTrackSchema>;
