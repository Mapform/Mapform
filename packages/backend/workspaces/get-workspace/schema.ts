import { z } from "zod";
import { userAuthSchema } from "../../auth-schema";

export const getWorkspaceSchema = z
  .object({
    slug: z.string(),
  })
  .merge(userAuthSchema);

export type GetWorkspaceSchema = z.infer<typeof getWorkspaceSchema>;
