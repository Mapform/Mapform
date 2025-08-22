"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const uploadImageAction = async (
  params: Last<Parameters<typeof authClient.uploadImage>>,
) => {
  const result = await authClient.uploadImage(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
