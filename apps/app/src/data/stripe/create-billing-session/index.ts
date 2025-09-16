"use server";

import { redirect } from "next/navigation";
import { authDataService } from "~/lib/safe-action";

export const createBillingSessionAction = async (
  params: Last<Parameters<typeof authDataService.createBillingSession>>,
) => {
  const result = await authDataService.createBillingSession(params);

  if (!result?.data?.url) {
    return result;
  }

  redirect(result.data.url);

  return result;
};
