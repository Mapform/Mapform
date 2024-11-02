"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { eq } from "@mapform/db/utils";
import { columns } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { deleteColumnSchema } from "./schema";

export const deleteColumn = authAction
  .schema(deleteColumnSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.delete(columns).where(eq(columns.id, id));

    revalidatePath("/[wsSlug]/[tsSlug]/datasets/[dId]", "page");
    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
