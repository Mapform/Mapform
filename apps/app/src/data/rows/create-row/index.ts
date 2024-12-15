"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createRowAction = async (
  params: Parameters<typeof authClient.createRow>[0],
) => {
  const result = await authClient.createRow(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/datasets/[dId]", "page");

  return result;
};
