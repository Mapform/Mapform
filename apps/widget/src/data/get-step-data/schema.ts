import { z } from "zod";

export const getStepDataSchema = z.object({
  stepId: z.string(),
});

export type GetStepDataSchema = z.infer<typeof getStepDataSchema>;
