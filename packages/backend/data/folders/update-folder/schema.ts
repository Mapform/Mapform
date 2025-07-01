import { selectFolderSchema } from "@mapform/db/schema";
import { z } from "zod";

export const updateFolderSchema = z
  .object({
    id: selectFolderSchema.shape.id,
  })
  .merge(selectFolderSchema.partial().omit({ id: true }));

export type UpdateFolderSchema = z.infer<typeof updateFolderSchema>;
