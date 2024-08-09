import { z } from "zod";

export const editDataTrackSchema = z.object({
  datatrackId: z.string(),
});
export type EditDataTrackSchema = z.infer<typeof editDataTrackSchema>;
