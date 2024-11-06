import type { z } from "zod";
import { insertUserSchema } from "@mapform/db/schema";

export const completeOnboardingSchema = insertUserSchema.pick({
  name: true,
});

export type CompleteOnboardingSchema = z.infer<typeof completeOnboardingSchema>;
