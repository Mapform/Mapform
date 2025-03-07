"use server";

import { redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export const completeOnboardingAction = async (
  params: Last<Parameters<typeof authClient.completeOnboarding>>,
) => {
  const result = await authClient.completeOnboarding(params);

  if (!result?.serverError && !result?.validationErrors) {
    redirect(`/app/${params.workspaceSlug}`);
  }

  return result;
};
