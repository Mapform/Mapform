"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createPointAction = async (
  params: Last<Parameters<typeof authClient.createPoint>>,
) => {
  const result = await authClient.createPoint(params);

  revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");

  return result;
};
