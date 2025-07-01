"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createFolderAction = async (
  params: Last<Parameters<typeof authClient.createFolder>>,
) => {
  const result = await authClient.createFolder(params);

  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
