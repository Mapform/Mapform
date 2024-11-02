"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { eq } from "@mapform/db/utils";
import { columns } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { editColumnSchema } from "./schema";

export const editColumn = authAction
  .schema(editColumnSchema)
  .action(async ({ parsedInput: { name, id } }) => {
    const [col] = await db
      .update(columns)
      .set({ name })
      .where(eq(columns.id, id))
      .returning();

    return col;
  });
