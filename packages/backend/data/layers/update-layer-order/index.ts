"server-only";

import { db } from "@mapform/db";
import { layersToPages, projects } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { updateLayerOrderSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const updateLayerOrder = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
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
