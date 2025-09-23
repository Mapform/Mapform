"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const deleteImageAction = async (
  params: Last<Parameters<typeof authDataService.deleteImage>>,
) => {
  const result = await authDataService.deleteImage(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
