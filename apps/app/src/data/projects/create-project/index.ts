"use server";

import { revalidatePath } from "next/cache";
import { createProject } from "@mapform/backend/projects/create-project";
import { createProjectSchema } from "@mapform/backend/projects/create-project/schema";
import { authAction } from "~/lib/safe-action";

export const createProjectAction = authAction
  .schema(createProjectSchema)
  .action(async ({ parsedInput, ctx: { checkAccessToTeamspaceById } }) => {
    if (!checkAccessToTeamspaceById(parsedInput.teamspaceId)) {
      throw new Error("You do not have access to this teamspace.");
    }

    const project = createProject(parsedInput);

    revalidatePath("/app/[wsSlug]/[tsSlug]", "page");

    return project;
  });
