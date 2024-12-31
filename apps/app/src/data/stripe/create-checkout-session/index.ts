"use server";

import { redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export const createCheckoutSessionAction = async (
  params: Last<Parameters<typeof authClient.createCheckoutSession>>,
) => {
  const result = await authClient.createCheckoutSession(params);

  if (!result?.data?.url) {
    return result;
  }

  redirect(result.data.url);

  return result;
};
