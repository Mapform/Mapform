"use server";

import { revalidatePath } from "next/cache";
import { deleteProject } from "@mapform/backend/projects/delete-project";
import { deleteProjectSchema } from "@mapform/backend/projects/delete-project/schema";
import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { datasets } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";

export const deleteProjectAction = authAction
  .schema(deleteProjectSchema)
  .action(async ({ parsedInput, ctx: { checkAccessToTeamspaceBySlug } }) => {
    const project = await db.query.projects.findFirst({
      where: eq(datasets.id, parsedInput.projectId),
      with: {
        teamspace: {
          columns: {
            slug: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    if (!checkAccessToTeamspaceBySlug(project.teamspace.slug)) {
      throw new Error("Unauthorized");
    }

    await deleteProject(parsedInput);

    revalidatePath("/app/[wsSlug]", "page");
  });
