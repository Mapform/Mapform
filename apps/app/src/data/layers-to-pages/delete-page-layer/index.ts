"use server";

import { revalidatePath } from "next/cache";
import { deletePageLayer } from "@mapform/backend/layers-to-pages/delete-page-layer";
import { deletePageLayerSchema } from "@mapform/backend/layers-to-pages/delete-page-layer/schema";
import { authAction } from "~/lib/safe-action";

export const deletePageLayerAction = authAction
  .schema(deletePageLayerSchema)
  .action(async ({ parsedInput }) => {
    await deletePageLayer(parsedInput);

    revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
