import { z } from "zod";
import { insertProjectSchema } from "@mapform/db/schema";

export const createProjectSchema = z.object({
  teamspaceId: insertProjectSchema.shape.teamspaceId,
  viewType: z.enum(["table", "map"]),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
