import { z } from "zod";

export const publishProjectSchema = z.object({
  projectId: z.string(),
});

export type PublishProjectSchema = z.infer<typeof publishProjectSchema>;
