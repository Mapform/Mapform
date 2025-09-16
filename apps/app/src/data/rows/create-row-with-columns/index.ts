"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createRowWithColumnsAction = async (
  params: Last<Parameters<typeof authClient.createRow>>,
) => {
  // 1. Create row has properties included
  // 2. Check if columns are already created
  // 3. If not, create columns
  // 4. Call createRow with the properties included
  // Everything should be wrapped in a transaction
  // const result = await authClient.createColumn(params);
  // revalidatePath("/app/[wsSlug]/[pId]", "page");
  // return result;
};
