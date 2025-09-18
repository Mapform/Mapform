"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export async function createColumnAction(
  params: Last<Parameters<typeof authDataService.createColumn>>,
) {
  const newColumn = await authDataService.createColumn(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return newColumn;
}
