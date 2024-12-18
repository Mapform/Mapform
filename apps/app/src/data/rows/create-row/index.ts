"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createRowAction = async (
  params: Last<Parameters<typeof authClient.createRow>>,
) => {
  const result = await authClient.createRow(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/datasets/[dId]", "page");

  return result;
};
