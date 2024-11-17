"use server";

import { revalidatePath } from "next/cache";
import { deleteDataset } from "@mapform/backend/datasets/delete-dataset";
import { deleteDatasetSchema } from "@mapform/backend/datasets/delete-dataset/schema";
import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { datasets } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";

export const deleteDatasetAction = authAction
  .schema(deleteDatasetSchema)
  .action(async ({ parsedInput, ctx: { checkAccessToTeamspace } }) => {
    const dataset = await db.query.datasets.findFirst({
      where: eq(datasets.id, parsedInput.datasetId),
      with: {
        teamspace: {
          columns: {
            slug: true,
          },
        },
      },
    });

    if (!dataset) {
      throw new Error("Dataset not found");
    }

    if (!checkAccessToTeamspace(dataset.teamspace.slug)) {
      throw new Error("Unauthorized");
    }

    await deleteDataset(parsedInput);

    revalidatePath("/app/[wsSlug]", "page");
  });
