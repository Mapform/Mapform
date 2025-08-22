"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createViewAction = async (
  params: Last<Parameters<typeof authClient.createView>>,
) => {
  const result = await authClient.createView(params);

  revalidatePath(`/app/[wsSlug]/${params.projectId}`, "page");

  return result;
};
