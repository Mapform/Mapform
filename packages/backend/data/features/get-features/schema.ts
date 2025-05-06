import { z } from "zod";

export const getFeaturesSchema = z.object({
  pageId: z.string(),
});

export type GetPageDataSchema = z.infer<typeof getFeaturesSchema>;
