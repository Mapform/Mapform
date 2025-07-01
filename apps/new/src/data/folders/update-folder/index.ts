"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const updateFolderAction = async (
  params: Last<Parameters<typeof authClient.updateFolder>>,
) => {
  const result = await authClient.updateFolder(params);

  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
