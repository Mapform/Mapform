"use server";

import { revalidatePath } from "next/cache";
import { duplicateRows } from "@mapform/backend/rows/duplicate-rows";
import { duplicateRowsSchema } from "@mapform/backend/rows/duplicate-rows/schema";
import { authAction } from "~/lib/safe-action";

export const duplicateRowsAction = authAction
  .schema(duplicateRowsSchema)
  .action(async ({ parsedInput }) => {
    await duplicateRows(parsedInput);

    revalidatePath("/[wsSlug]/[tsSlug]/datasets/[dId]", "page");
  });
