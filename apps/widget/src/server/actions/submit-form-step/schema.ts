import { z } from "zod";

export const submitFormStepSchema = z.object({
  stepId: z.string(),
  payload: z.record(z.string(), z.unknown()),
});
