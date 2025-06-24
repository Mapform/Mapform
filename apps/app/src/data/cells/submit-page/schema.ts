import { z } from "zod/v4";

export const submitPageSchema = z.object({
  pageId: z.string(),
  // aka the row id
  submissionId: z.string(),
  // TODO: Validate each individual block input
  payload: z.record(z.string(), z.unknown()),
});
