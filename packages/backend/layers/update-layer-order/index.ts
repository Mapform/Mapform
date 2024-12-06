import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { layersToPages, projects } from "@mapform/db/schema";
import type { UpdateLayerOrderSchema } from "./schema";

export const updateLayerOrder = async ({
  pageId,
  layerOrder,
}: UpdateLayerOrderSchema) => {
  const page = await db.query.pages.findFirst({
    where: eq(projects.id, pageId),
  });

  if (!page) {
    throw new Error("Page not found");
  }

  await db.transaction(async (tx) =>
    Promise.all(
      layerOrder.map((layerId, index) =>
        tx
          .update(layersToPages)
          .set({
            position: index + 1,
          })
          .where(eq(layersToPages.layerId, layerId))
          .returning(),
      ),
    ),
  );
};
