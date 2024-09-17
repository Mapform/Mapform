import { z } from "zod";

export const updateFormSchema = z.object({
  formId: z.string(),
  data: z
    .object({
      name: z.string(),
      stepOrder: z.array(z.string()),
      isDirty: z.boolean(),
      isClosed: z.boolean(),
    })
    .partial(),
});

export type UpdateFormSchema = z.infer<typeof updateFormSchema>;
