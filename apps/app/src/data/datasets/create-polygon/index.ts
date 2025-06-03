"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createPolygonAction = async (
  params: Last<Parameters<typeof authClient.createPolygon>>,
) => {
  const result = await authClient.createPolygon(params);

  revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");

  return result;
};
