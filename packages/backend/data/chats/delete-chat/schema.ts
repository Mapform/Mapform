import { z } from "zod";
import { selectChatSchema } from "@mapform/db/schema";

export const deleteChatSchema = z.object({
  id: selectChatSchema.shape.id,
});

export type DeleteChatSchema = z.infer<typeof deleteChatSchema>;
