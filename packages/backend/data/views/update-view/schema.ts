import { z } from "zod";
import { viewTypes } from "@mapform/db/schema";

export const updateViewSchema = z.object({
  viewId: z.string(),
  viewType: z.enum(viewTypes.enumValues).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateViewSchema = z.infer<typeof updateViewSchema>;
