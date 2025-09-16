"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const uploadImageAction = async (
  params: Last<Parameters<typeof authDataService.uploadImage>>,
) => {
  const result = await authDataService.uploadImage(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
