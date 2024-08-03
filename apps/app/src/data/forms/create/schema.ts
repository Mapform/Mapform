import { z } from "zod";

export const createFormSchema = z.object({
  name: z.string().min(3),
  workspaceId: z.string(),
});

export type CreateFormSchema = z.infer<typeof createFormSchema>;