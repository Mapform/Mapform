import { z } from "zod";

export const submitFormStepSchema = z.object({
  stepId: z.string(),
  formSubmissionId: z.string(),
  // TODO: Validate each individual block input
  payload: z.record(z.any(), z.unknown()),
});
