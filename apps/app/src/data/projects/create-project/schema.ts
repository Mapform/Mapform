import { z } from "zod";
import { insertProjectSchema } from "@mapform/db/schema";

export const createProjectSchema = z.object({
  name: insertProjectSchema.shape.name,
  teamspaceId: insertProjectSchema.shape.teamspaceId,
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
