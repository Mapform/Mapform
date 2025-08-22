"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const updateProjectOrderAction = async (
  params: Last<Parameters<typeof authClient.updateProjectOrder>>,
) => {
  const result = await authClient.updateProjectOrder(params);

  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
