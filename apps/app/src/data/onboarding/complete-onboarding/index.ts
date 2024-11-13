"use server";

import { redirect } from "next/navigation";
import { completeOnboarding } from "@mapform/backend/onboarding/complete-onboarding";
import { completeOnboardingSchema } from "@mapform/backend/onboarding/complete-onboarding/schema";
import { authAction } from "~/lib/safe-action";

export const completeOnboardingAction = authAction
  .schema(completeOnboardingSchema)
  .action(async ({ parsedInput: { name }, ctx: { user } }) => {
    const { slug } = await completeOnboarding({ name, userId: user.id });

    redirect(`/${slug}`);
  });
