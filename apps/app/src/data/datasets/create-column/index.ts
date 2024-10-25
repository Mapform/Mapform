"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { columns } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { createColumnSchema } from "./schema";

export const createColumn = authAction
  .schema(createColumnSchema)
  .action(async ({ parsedInput: { name, datasetId, type } }) => {
    const [newColumn] = await db
      .insert(columns)
      .values({
        name,
        datasetId,
        type,
      })
      .returning();

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return newColumn;
  });
