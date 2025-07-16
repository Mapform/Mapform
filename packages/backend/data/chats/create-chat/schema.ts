import { z } from "zod";
import { selectColumnSchema } from "@mapform/db/schema";

export const createChatSchema = z.object({
  id: selectColumnSchema.shape.id,
  name: selectColumnSchema.shape.name,
  projectId: selectColumnSchema.shape.projectId,
});

export type CreateChatSchema = z.infer<typeof createChatSchema>;
