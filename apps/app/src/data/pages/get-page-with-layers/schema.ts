import { z } from "zod";

export const getPageWithLayersSchema = z.object({
  id: z.string(),
});

export type GetPageWithLayersSchema = z.infer<typeof getPageWithLayersSchema>;
