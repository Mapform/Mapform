"use server";

import { redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export const completeOnboardingAction = async (
  params: Last<Parameters<typeof authClient.completeOnboarding>>,
) => {
  await authClient.completeOnboarding(params);

  redirect(`/app/${params.workspaceSlug}`);
};
