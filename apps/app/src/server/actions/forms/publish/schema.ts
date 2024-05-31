import { z } from "zod";

export const publishFormSchema = z.object({
  formId: z.string(),
});

export type PublishFormSchema = z.infer<typeof publishFormSchema>;
