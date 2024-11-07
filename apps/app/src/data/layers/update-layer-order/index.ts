"use server";

import { revalidatePath } from "next/cache";
import { updateLayerOrder } from "@mapform/backend/layers/update-layer-order";
import { updateLayerOrderSchema } from "@mapform/backend/layers/update-layer-order/schema";
import { authAction } from "~/lib/safe-action";

export const updateLayerOrderAction = authAction
  .schema(updateLayerOrderSchema)
  .action(async ({ parsedInput }) => {
    await updateLayerOrder(parsedInput);

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
