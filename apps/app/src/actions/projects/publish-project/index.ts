"use server";

import { revalidatePath } from "next/cache";
import { publishProject } from "@mapform/backend/projects/publish-project";
import { publishProjectSchema } from "@mapform/backend/projects/publish-project/schema";
import { authAction } from "~/lib/safe-action";

/**
 * When we publish, we always create a new form version. By keeping track of
 * version history, we can allow users to revert to previous versions, and we
 * can show more detailed submission results.
 */
export const publishProjectAction = authAction
  .schema(publishProjectSchema)
  .action(async ({ parsedInput: { projectId } }) => {
    await publishProject({ projectId });

    revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
