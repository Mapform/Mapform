"use server";

import { updatePage } from "@mapform/backend/pages/update-page";
import { updatePageSchema } from "@mapform/backend/pages/update-page/schema";
import { authAction } from "~/lib/safe-action";

export const updatePageAction = authAction
  .schema(updatePageSchema)
  .action(async ({ parsedInput }) => {
    await updatePage(parsedInput);
  });
