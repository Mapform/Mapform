import { z } from "zod";
import { FormSchema } from "@mapform/db/prisma/zod";

export const updateFormSchema = z.object({
  formId: z.string(),
  data: FormSchema.partial(),
});

export type UpdateFormSchema = z.infer<typeof updateFormSchema>;
