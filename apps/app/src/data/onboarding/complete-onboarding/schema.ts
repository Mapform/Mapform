import { z } from "zod";

export const completeOnboardingSchema = z.object({
  userName: z.string().min(2),
});

export type CompleteOnboardingSchema = z.infer<typeof completeOnboardingSchema>;
