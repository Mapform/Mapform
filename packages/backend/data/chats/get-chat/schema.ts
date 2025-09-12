import { z } from "zod";

export const getChatSchema = z.object({
  id: z.string(),
});
