import { selectWorkspaceSchema } from "@mapform/db/schema";
import { z } from "zod/v4";

export const updateWorkspaceSchema = z.object({
  id: selectWorkspaceSchema.shape.id,
  name: selectWorkspaceSchema.shape.name.optional(),
  slug: selectWorkspaceSchema.shape.slug.optional(),
});

export type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema>;
