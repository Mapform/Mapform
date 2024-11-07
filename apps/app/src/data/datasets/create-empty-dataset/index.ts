"use server";

import { revalidatePath } from "next/cache";
import { createEmptyDataset } from "@mapform/backend/datasets/create-empty-dataset";
import { createEmptyDatasetSchema } from "@mapform/backend/datasets/create-empty-dataset/schema";
import { authAction } from "~/lib/safe-action";

export const createEmptyDatasetAction = authAction
  .schema(createEmptyDatasetSchema)
  .action(async ({ parsedInput }) => {
    const response = await createEmptyDataset(parsedInput);

    revalidatePath("/[wsSlug]/[tsSlug]/datasets", "page");
    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return response;
  });
