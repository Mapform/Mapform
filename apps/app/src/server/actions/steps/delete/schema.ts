import { z } from "zod";

export const deleteStepSchema = z.object({
  stepId: z.string(),
});

export type DeleteStepSchema = z.infer<typeof deleteStepSchema>;
