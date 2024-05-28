import { z } from "zod";

export const createFormSubmissionSchema = z.object({
  formId: z.string(),
});
