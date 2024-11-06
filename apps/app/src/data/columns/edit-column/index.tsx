"use server";

import { revalidatePath } from "next/cache";
import { editColumn } from "@mapform/backend/columns/edit-column";
import { editColumnSchema } from "@mapform/backend/columns/edit-column/schema";
import { authAction } from "~/lib/safe-action";

export const editColumnAction = authAction
  .schema(editColumnSchema)
  .action(async ({ parsedInput: { name, id } }) => {
    const col = await editColumn({ name, id });

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return col;
  });
