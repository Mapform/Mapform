import { z } from "zod";

export const getMessagesSchema = z.object({
  chatId: z.string(),
});
