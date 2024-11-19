"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createEmptyDataset } from "@mapform/backend/datasets/create-empty-dataset";
import { authAction } from "~/lib/safe-action";
import { extendedCreateEmptyDatasetSchema } from "./schema";

export const createEmptyDatasetAction = authAction
  .schema(extendedCreateEmptyDatasetSchema)
  .action(
    async ({ parsedInput, ctx: { user, checkAccessToTeamspaceById } }) => {
      if (!checkAccessToTeamspaceById(parsedInput.teamspaceId)) {
        throw new Error("You do not have access to this teamspace.");
      }

      const workspaceForNewProject = user.workspaceMemberships
        .flatMap((wm) => wm.workspace)
        .find((ws) =>
          ws.teamspaces.some((ts) => ts.id === parsedInput.teamspaceId),
        );

      const teamspaceForNewProject = workspaceForNewProject?.teamspaces.find(
        (ts) => ts.id === parsedInput.teamspaceId,
      );

      const response = await createEmptyDataset(parsedInput);

      if (!response.dataset) {
        throw new Error("Failed to create dataset");
      }

      revalidatePath("/app/[wsSlug]/[tsSlug]/datasets", "page");
      revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

      if (parsedInput.redirectAfterCreate) {
        redirect(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We know they exist
          `/app/${workspaceForNewProject!.slug}/${teamspaceForNewProject!.slug}/datasets/${response.dataset.id}`,
        );
      }

      return response;
    },
  );
