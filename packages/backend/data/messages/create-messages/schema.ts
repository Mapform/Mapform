import { z } from "zod";
import { insertMessageSchema } from "@mapform/db/schema";

export const createMessagesSchema = z.object({
  messages: z.array(
    z.object({
      role: insertMessageSchema.shape.role,
      parts: insertMessageSchema.shape.parts,
    }),
  ),
  chatId: insertMessageSchema.shape.chatId,
});

export type CreateMessagesSchema = z.infer<typeof createMessagesSchema>;
