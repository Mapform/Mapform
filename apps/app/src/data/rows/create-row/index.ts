"use server";

import { revalidatePath } from "next/cache";
import { createRow } from "@mapform/backend/rows/create-row";
import { createRowSchema } from "@mapform/backend/rows/create-row/schema";
import { authAction } from "~/lib/safe-action";

export const createRowAction = authAction
  .schema(createRowSchema)
  .action(async ({ parsedInput: { datasetId } }) => {
    const newRow = await createRow({ datasetId });

    revalidatePath("/[wsSlug]/[tsSlug]/datasets/[dId]", "page");

    return newRow;
  });
