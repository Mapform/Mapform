import { z } from "zod";
import { insertUserSchema, insertWorkspaceSchema } from "@mapform/db/schema";

export const completeOnboardingSchema = z.object({
  userName: insertUserSchema.shape.name,
  workspaceName: insertWorkspaceSchema.shape.name,
});

export type CompleteOnboardingSchema = z.infer<typeof completeOnboardingSchema>;
