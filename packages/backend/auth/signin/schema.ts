import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type SignUpSchema = z.infer<typeof SignUpSchema>;
