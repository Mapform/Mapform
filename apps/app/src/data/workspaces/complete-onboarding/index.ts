"use server";

import { redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export const completeOnboardingAction = async (
  params: Parameters<typeof authClient.completeOnboarding>[0],
) => {
  await authClient.completeOnboarding(params);

  redirect(`/app/${params.workspaceSlug}`);
};
