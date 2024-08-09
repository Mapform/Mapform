import { z } from "zod";

export const deleteDataTrackSchema = z.object({
  datatrackId: z.string(),
});
export type DeleteDataTrackSchema = z.infer<typeof deleteDataTrackSchema>;
