import { z } from "zod";
import { StepSchema } from "@mapform/db/prisma/zod";

export const updateStepSchema = z.object({
  stepId: z.string(),
  data: StepSchema,
});

export type UpdateStepSchema = z.infer<typeof updateStepSchema>;
