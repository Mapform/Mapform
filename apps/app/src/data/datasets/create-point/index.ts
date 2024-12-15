"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createPointAction = async (
  params: Parameters<typeof authClient.createPoint>[0],
) => {
  const result = await authClient.createPoint(params);

  revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");

  return result;
};
