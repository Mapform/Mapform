"use server";

import { redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export const createBillingSessionAction = async (
  params: Last<Parameters<typeof authClient.createBillingSession>>,
) => {
  const result = await authClient.createBillingSession(params);

  if (!result?.data?.url) {
    return result;
  }

  redirect(result.data.url);

  return result;
};
