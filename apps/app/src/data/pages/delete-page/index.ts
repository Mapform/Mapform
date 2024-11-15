"use server";

import { revalidatePath } from "next/cache";
import { deletePage } from "@mapform/backend/pages/delete-page";
import { deletePageSchema } from "@mapform/backend/pages/delete-page/schema";
import { authAction } from "~/lib/safe-action";

export const deletePageAction = authAction
  .schema(deletePageSchema)
  .action(async ({ parsedInput }) => {
    await deletePage(parsedInput);

    revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
