import { z } from "zod";

export const searchRowsSchema = z.object({
  query: z.string(),
  projectId: z.string(),
});

export type SearchRowsSchema = z.infer<typeof searchRowsSchema>;
