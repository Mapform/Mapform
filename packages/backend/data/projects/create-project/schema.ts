import { z } from "zod";
import { insertProjectSchema, viewTypes } from "@mapform/db/schema";

export const createProjectSchema = z.object({
  teamspaceId: insertProjectSchema.shape.teamspaceId,
  viewType: z.enum(viewTypes.enumValues),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
