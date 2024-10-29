"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { inArray } from "@mapform/db/utils";
import { rows } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { deleteRowsSchema } from "./schema";

export const deleteRows = authAction
  .schema(deleteRowsSchema)
  .action(async ({ parsedInput: { rowIds } }) => {
    await db.delete(rows).where(inArray(rows.id, rowIds));

    revalidatePath("/[wsSlug]/[tsSlug]/datasets/[dId]", "page");
  });
