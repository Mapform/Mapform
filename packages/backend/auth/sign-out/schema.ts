import { z } from "zod";

export const signOutSchema = z.object({
  token: z.string(),
});

export type SignOutSchema = z.infer<typeof signOutSchema>;
