"use server";

import { revalidatePath } from "next/cache";
import { deleteLayer } from "@mapform/backend/layers/delete-layer";
import { deleteLayerSchema } from "@mapform/backend/layers/delete-layer/schema";
import { authAction } from "~/lib/safe-action";

export const deleteLayerAction = authAction
  .schema(deleteLayerSchema)
  .action(async ({ parsedInput }) => {
    await deleteLayer(parsedInput);

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
