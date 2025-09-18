"use server";

import { redirect } from "next/navigation";
import { authDataService } from "~/lib/safe-action";

export const completeOnboardingAction = async (
  params: Last<Parameters<typeof authDataService.completeOnboarding>>,
) => {
  const result = await authDataService.completeOnboarding(params);

  if (!result?.serverError && !result?.validationErrors) {
    redirect(`/app/${params.workspaceSlug}`);
  }

  return result;
};
