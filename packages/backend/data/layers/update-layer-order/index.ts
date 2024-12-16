"server-only";

import { db } from "@mapform/db";
import { layersToPages, projects } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { updateLayerOrderSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const updateLayerOrder = (authClient: UserAuthClient) =>
  authClient
    .schema(updateLayerOrderSchema)
    .action(async ({ parsedInput: { pageId, layerOrder } }) => {
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
    });
