import { z } from "zod";
import type { DataTrack } from "@mapform/db";

export const updateDataTrackSchema = z.object({
  datatrackId: z.string(),
  name: z.string().optional(),
} as TypeToZod<
  {
    datatrackId: string;
  } & Pick<DataTrack, "name">
>);
export type UpdateDataTrackSchema = z.infer<typeof updateDataTrackSchema>;
