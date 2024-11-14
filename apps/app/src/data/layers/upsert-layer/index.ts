"use server";

import { revalidatePath } from "next/cache";
import { upsertLayer } from "@mapform/backend/layers/upsert-layer";
import { upsertLayerSchema } from "@mapform/backend/layers/upsert-layer/schema";
import { authAction } from "~/lib/safe-action";

export const upsertLayerAction = authAction
  .schema(upsertLayerSchema)
  .action(async ({ parsedInput }) => {
    const newLayer = await upsertLayer(parsedInput);

    revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

    return newLayer;
  });
