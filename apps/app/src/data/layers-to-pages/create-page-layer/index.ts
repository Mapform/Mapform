"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { eq } from "@mapform/db/utils";
import { layersToPages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { createPageLayerSchema } from "./schema";

export const createPageLayer = authAction
  .schema(createPageLayerSchema)
  .action(async ({ parsedInput: { layerId, pageId } }) => {
    const existingPageLayers = await db.query.layersToPages.findMany({
      where: eq(layersToPages.layerId, layerId),
    });

    await db
      .insert(layersToPages)
      .values({
        layerId,
        pageId,
        position: existingPageLayers.length + 1,
      })
      .returning();

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
