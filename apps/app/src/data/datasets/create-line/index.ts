"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createLineAction = async (
  params: Last<Parameters<typeof authClient.createLine>>,
) => {
  const result = await authClient.createLine(params);

  revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");

  return result;
};
