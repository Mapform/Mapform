import { z } from "zod";
import {
  insertProjectSchema,
  selectFileTreePositionSchema,
  viewTypes,
} from "@mapform/db/schema";

export const createProjectSchema = z.object({
  teamspaceId: insertProjectSchema.shape.teamspaceId,
  viewType: z.enum(viewTypes.enumValues),
  parentId: selectFileTreePositionSchema.shape.parentId.optional(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
