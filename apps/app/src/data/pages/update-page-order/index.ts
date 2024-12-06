"use server";

import { revalidatePath } from "next/cache";
import { updatePageOrder } from "@mapform/backend/pages/update-page-order";
import { updatePageOrderSchema } from "@mapform/backend/pages/update-page-order/schema";
import { authAction } from "~/lib/safe-action";

export const updatePageOrderAction = authAction
  .schema(updatePageOrderSchema)
  .action(async ({ parsedInput }) => {
    await updatePageOrder(parsedInput);

    revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
