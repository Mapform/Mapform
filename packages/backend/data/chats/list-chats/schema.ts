import { z } from "zod";

export const listChatsSchema = z.object({
  projectId: z.string().optional(),
});
