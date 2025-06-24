import { z } from "zod/v4";
import { insertUserSchema } from "@mapform/db/schema";

export const updateCurrentUserSchema = z.object({
  name: insertUserSchema.shape.name.optional(),
  projectGuideCompleted: z.boolean().optional(),
  workspaceGuideCompleted: z.boolean().optional(),
});

export type UpdateCurrentUserSchema = z.infer<typeof updateCurrentUserSchema>;
