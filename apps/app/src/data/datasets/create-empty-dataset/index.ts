"use server";

import { revalidatePath } from "next/cache";
import { createEmptyDataset } from "@mapform/backend/datasets/create-empty-dataset";
import { createEmptyDatasetSchema } from "@mapform/backend/datasets/create-empty-dataset/schema";
import { authAction } from "~/lib/safe-action";

export const createEmptyDatasetAction = authAction
  .schema(createEmptyDatasetSchema)
  .action(async ({ parsedInput, ctx: { checkAccessToTeamspaceById } }) => {
    if (!checkAccessToTeamspaceById(parsedInput.teamspaceId)) {
      throw new Error("You do not have access to this teamspace.");
    }

    const response = await createEmptyDataset(parsedInput);

    revalidatePath("/app/[wsSlug]/[tsSlug]/datasets", "page");
    revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return response;
  });
