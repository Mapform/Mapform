import { z } from "zod";
import { selectChatSchema } from "@mapform/db/schema";

export const updateChatSchema = z.object({
  id: selectChatSchema.shape.id,
  title: selectChatSchema.shape.title.optional(),
  activeStreamId: selectChatSchema.shape.activeStreamId,
});

export type UpdateChatSchema = z.infer<typeof updateChatSchema>;
