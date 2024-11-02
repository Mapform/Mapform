"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { rows } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { createRowSchema } from "./schema";

export const createRow = authAction
  .schema(createRowSchema)
  .action(async ({ parsedInput: { datasetId } }) => {
    const [newRow] = await db
      .insert(rows)
      .values({
        datasetId,
      })
      .returning();

    revalidatePath("/[wsSlug]/[tsSlug]/datasets/[dId]", "page");

    return newRow;
  });
