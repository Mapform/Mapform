"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const editColumnAction = async (
  params: Parameters<typeof authClient.editColumn>[0],
) => {
  const result = await authClient.editColumn(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
