"use server";

import { revalidatePath } from "next/cache";
import { updateDataset } from "@mapform/backend/datasets/update-dataset";
import { updateDatasetSchema } from "@mapform/backend/datasets/update-dataset/schema";
import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { datasets } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";

export const updateDatasetAction = authAction
  .schema(updateDatasetSchema)
  .action(async ({ parsedInput, ctx: { checkAccessToTeamspaceById } }) => {
    const existingDataset = await db.query.datasets.findFirst({
      where: eq(datasets.id, parsedInput.id),
    });

    if (!existingDataset) {
      throw new Error("Dataset not found.");
    }

    if (!checkAccessToTeamspaceById(existingDataset.teamspaceId)) {
      throw new Error("You do not have access to this teamspace.");
    }

    await updateDataset(parsedInput);

    revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");
  });
