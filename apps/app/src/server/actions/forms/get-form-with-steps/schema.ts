import { z } from "zod";

export const getFormWithStepsSchema = z.object({
  formId: z.string(),
});

export type GetFormWithStepsSchema = z.infer<typeof getFormWithStepsSchema>;
