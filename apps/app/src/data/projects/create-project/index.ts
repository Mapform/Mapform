"use server";

import { revalidatePath } from "next/cache";
import { createProject } from "@mapform/backend/projects/create-project";
import { createProjectSchema } from "@mapform/backend/projects/create-project/schema";
import { authAction } from "~/lib/safe-action";

export const createProjectAction = authAction
  .schema(createProjectSchema)
  .action(async ({ parsedInput }) => {
    const project = createProject(parsedInput);

    revalidatePath("/[wsSlug]/[tsSlug]", "page");

    return project;
  });
