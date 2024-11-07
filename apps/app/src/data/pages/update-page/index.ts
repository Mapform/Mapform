"use server";

import { revalidatePath } from "next/cache";
import { updatePage } from "@mapform/backend/pages/update-page";
import { updatePageSchema } from "@mapform/backend/pages/update-page/schema";
import { authAction } from "~/lib/safe-action";

export const updatePageAction = authAction
  .schema(updatePageSchema)
  .action(async ({ parsedInput }) => {
    const page = await updatePage(parsedInput);

    revalidatePath(
      `/${page.project.teamspace.workspace.id}/${page.project.teamspace.id}/projects/${page.project.id}`,
    );
  });
