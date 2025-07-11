import { z } from "zod";
import { insertProjectSchema, viewTypes } from "@mapform/db/schema";

export const createProjectSchema = z.object({
  teamspaceId: insertProjectSchema.shape.teamspaceId,
  viewType: z.enum(viewTypes.enumValues),
  center: z.tuple([z.number(), z.number()]),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
