import { z } from "zod";

export const createOrgSchema = z.object({
  name: z.string(),
});

export type CreateOrgSchema = z.infer<typeof createOrgSchema>;
