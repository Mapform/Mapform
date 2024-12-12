import { z } from "zod";

export const getCurrentWorkspaceMembershipSchema = z.object({
  userId: z.string(),
});

export type CetCurrentWorkspaceMembershipSchema = z.infer<
  typeof getCurrentWorkspaceMembershipSchema
>;
