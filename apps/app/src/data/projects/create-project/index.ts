"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createProject } from "@mapform/backend/projects/create-project";
import { createProjectSchema } from "@mapform/backend/projects/create-project/schema";
import { authAction } from "~/lib/safe-action";

export const createProjectAction = authAction
  .schema(createProjectSchema)
  .action(
    async ({
      parsedInput,
      ctx: { user, checkAccessToTeamspaceById, workspaceSlug },
    }) => {
      if (!checkAccessToTeamspaceById(parsedInput.teamspaceId)) {
        throw new Error("You do not have access to this teamspace.");
      }

      const teamspaceSlug = user.workspaceMemberships
        .flatMap((wm) => wm.workspace.teamspaces.map((ts) => ts))
        .find((ts) => ts.id === parsedInput.teamspaceId)?.slug;

      const project = await createProject(parsedInput);

      revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");
      redirect(`/app/${workspaceSlug}/${teamspaceSlug}/projects/${project.id}`);
    },
  );
