"use server";

import { revalidatePath } from "next/cache";
import { createColumn } from "@mapform/backend/columns/create-column";
import { createColumnSchema } from "@mapform/backend/columns/create-column/schema";
import { authAction } from "~/lib/safe-action";

export const createColumnAction = authAction
  .schema(createColumnSchema)
  .action(async ({ parsedInput }) => {
    const newColumn = await createColumn(parsedInput);

    revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return newColumn;
  });
