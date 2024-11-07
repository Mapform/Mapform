"use server";

import { revalidatePath } from "next/cache";
import { deleteRows } from "@mapform/backend/rows/delete-rows";
import { deleteRowsSchema } from "@mapform/backend/rows/delete-rows/schema";
import { authAction } from "~/lib/safe-action";

export const deleteRowsAction = authAction
  .schema(deleteRowsSchema)
  .action(async ({ parsedInput }) => {
    await deleteRows(parsedInput);

    revalidatePath("/[wsSlug]/[tsSlug]/datasets/[dId]", "page");
  });
