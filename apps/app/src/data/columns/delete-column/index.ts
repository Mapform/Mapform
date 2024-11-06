"use server";

import { revalidatePath } from "next/cache";
import { deleteColumn } from "@mapform/backend/columns/delete-column";
import { deleteColumnSchema } from "@mapform/backend/columns/delete-column/schema";
import { authAction } from "~/lib/safe-action";

export const deleteColumnAction = authAction
  .schema(deleteColumnSchema)
  .action(async ({ parsedInput: { id } }) => {
    await deleteColumn({ id });

    revalidatePath("/[wsSlug]/[tsSlug]/datasets/[dId]", "page");
    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
