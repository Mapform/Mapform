import { z } from "zod";

export const createSubmissionSchema = z.object({
  projectId: z.string(),
});
