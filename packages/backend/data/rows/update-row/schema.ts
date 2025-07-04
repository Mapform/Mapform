import { z } from "zod";
import { updateRowSchema as dbUpdateRowSchema } from "@mapform/db/schema";

export const updateRowSchema = z.object({
  id: dbUpdateRowSchema.shape.id,
  name: dbUpdateRowSchema.shape.name,
  description: dbUpdateRowSchema.shape.description,
  // This is a temporary workaround for sending description content as MD to the
  // server since the Blocknote server side util needed to convert to Markdown
  // is not working:
  // https://github.com/TypeCellOS/BlockNote/issues/942#issuecomment-2570750560
  descriptionAsMarkdown: z.string().optional(),
  icon: dbUpdateRowSchema.shape.icon,
});

export type UpdateRowSchema = z.infer<typeof updateRowSchema>;
