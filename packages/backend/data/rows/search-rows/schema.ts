import { z } from "zod";

export const searchRowsSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("project"),
    query: z.string(),
    projectIds: z.string().array(),
  }),
  z.object({
    type: z.literal("workspace"),
    query: z.string(),
    workspaceSlug: z.string(),
  }),
]);

export type SearchRowsSchema = z.infer<typeof searchRowsSchema>;
