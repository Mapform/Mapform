"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { columns } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { upsertCellSchema } from "./schema";

export const upsertCell = authAction
  .schema(upsertCellSchema)
  .action(async ({ parsedInput: { rowId, columnId, type, value } }) => {
    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return newColumn;
  });
