"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createProject } from "@mapform/backend/projects/create-project";
import { createProjectSchema } from "@mapform/backend/projects/create-project/schema";
import { authAction } from "~/lib/safe-action";

export const createProjectAction = authAction
  .schema(createProjectSchema)
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

      const project = await createProject(parsedInput);

      revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");
      redirect(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We know they exist
        `/app/${workspaceForNewProject!.slug}/${teamspaceForNewProject!.slug}/projects/${project.id}`,
      );
    },
  );
