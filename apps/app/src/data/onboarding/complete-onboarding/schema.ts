import { z } from "zod";
import { insertUserSchema } from "@mapform/db";

export const completeOnboardingSchema = z.object({
  name: insertUserSchema.shape.name,
});

export type CompleteOnboardingSchema = z.infer<typeof completeOnboardingSchema>;
