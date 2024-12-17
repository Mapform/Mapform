import { z } from "zod";

export const getResponsesSchema = z.object({
  id: z.string(),
});

export type GetResponsesSchema = z.infer<typeof getResponsesSchema>;
