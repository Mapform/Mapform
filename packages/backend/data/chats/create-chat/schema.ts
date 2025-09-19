import { z } from "zod";
import { selectChatSchema } from "@mapform/db/schema";

export const createChatSchema = z.object({
  title: selectChatSchema.shape.title,
  projectId: selectChatSchema.shape.projectId,
});

export type CreateChatSchema = z.infer<typeof createChatSchema>;
