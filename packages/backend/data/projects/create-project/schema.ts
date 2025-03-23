import { z } from "zod";
import { insertProjectSchema } from "@mapform/db/schema";

export const createProjectSchema = z.object({
  name: insertProjectSchema.shape.name,
  description: insertProjectSchema.shape.description,
  teamspaceId: insertProjectSchema.shape.teamspaceId,
  formsEnabled: insertProjectSchema.shape.formsEnabled.default(false),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
