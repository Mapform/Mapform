import { z } from "zod";

export const submitPageSchema = z.object({
  pageId: z.string(),
  submissionId: z.string(),
  payload: z.record(z.string(), z.unknown()),
});
