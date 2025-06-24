import { z } from "zod/v4";
import { insertProjectSchema, viewTypes } from "@mapform/db/schema";

export const createViewSchema = z.object({
  projectId: insertProjectSchema.shape.teamspaceId,
  viewType: z.enum(viewTypes.enumValues),
});

export type CreateViewSchema = z.infer<typeof createViewSchema>;
