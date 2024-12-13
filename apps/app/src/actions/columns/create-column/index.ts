"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export async function createColumnAction(
  params: Parameters<typeof authClient.createColumn>[0],
) {
  const newColumn = await authClient.createColumn(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return newColumn;
}
