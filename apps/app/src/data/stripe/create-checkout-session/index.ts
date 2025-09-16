"use server";

import { redirect } from "next/navigation";
import { authDataService } from "~/lib/safe-action";

export const createCheckoutSessionAction = async (
  params: Last<Parameters<typeof authDataService.createCheckoutSession>>,
) => {
  const result = await authDataService.createCheckoutSession(params);

  if (!result?.data?.url) {
    return result;
  }

  redirect(result.data.url);

  return result;
};
