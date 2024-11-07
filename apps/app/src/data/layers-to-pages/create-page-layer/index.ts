"use server";

import { revalidatePath } from "next/cache";
import { createPageLayer } from "@mapform/backend/layers-to-pages/create-page-layer";
import { createPageLayerSchema } from "@mapform/backend/layers-to-pages/create-page-layer/schema";
import { authAction } from "~/lib/safe-action";

export const createPageLayerAction = authAction
  .schema(createPageLayerSchema)
  .action(async ({ parsedInput }) => {
    await createPageLayer(parsedInput);

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
