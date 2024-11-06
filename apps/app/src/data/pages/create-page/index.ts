"use server";

import { revalidatePath } from "next/cache";
import { createPage } from "@mapform/backend/pages/create-page";
import { createPageSchema } from "@mapform/backend/pages/create-page/schema";
import { authAction } from "~/lib/safe-action";

export const createPageAction = authAction
  .schema(createPageSchema)
  .action(async ({ parsedInput }) => {
    const page = await createPage(parsedInput);

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return page;
  });
