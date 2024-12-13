"use server";

import { revalidatePath } from "next/cache";
import { updateProject } from "@mapform/backend/projects/update-project";
import { updateProjectSchema } from "@mapform/backend/projects/update-project/schema";
import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";

export const updateProjectAction = authAction
  .schema(updateProjectSchema)
  .action(async ({ parsedInput, ctx: { checkAccessToTeamspaceById } }) => {
    const existingProject = await db.query.projects.findFirst({
      where: eq(projects.id, parsedInput.id),
    });

    if (!existingProject) {
      throw new Error("Project not found.");
    }

    if (!checkAccessToTeamspaceById(existingProject.teamspaceId)) {
      throw new Error("You do not have access to this teamspace.");
    }

    await updateProject(parsedInput);

    revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");
  });
