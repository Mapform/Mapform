"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { datasets } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { createEmptyDatasetSchema } from "./schema";

export const createEmptyDataset = authAction
  .schema(createEmptyDatasetSchema)
  .action(async ({ parsedInput: { name, teamspaceId } }) => {
    const [dataset] = await db
      .insert(datasets)
      .values({
        name,
        teamspaceId,
      })
      .returning();

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return dataset;
  });
