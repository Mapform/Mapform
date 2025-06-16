import { z } from "zod";

export const getProjectSchema = z.object({
  projectId: z.string(),
});
