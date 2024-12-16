"server-only";

import { db } from "@mapform/db";
import { layersToPages } from "@mapform/db/schema";
import { eq, and } from "@mapform/db/utils";
import { createPageLayerSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";

export const createPageLayer = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddlewareValidator)
    .schema(createPageLayerSchema)
    .action(
      async ({ parsedInput: { layerId, pageId }, ctx: { userAccess } }) => {
        const existingPageLayers = await db.query.layersToPages.findMany({
          where: and(
            eq(layersToPages.layerId, layerId),
            eq(layersToPages.pageId, pageId),
          ),
          with: {
            page: {
              with: {
                project: {
                  columns: {
                    teamspaceId: true,
                  },
                },
              },
            },
          },
        });

        if (
          existingPageLayers.some(
            (ltp) =>
              !userAccess.teamspace.ids.includes(ltp.page.project.teamspaceId),
          )
        ) {
          throw new Error("Unauthorized");
        }

        return db
          .insert(layersToPages)
          .values({
            layerId,
            pageId,
            position: existingPageLayers.length + 1,
          })
          .returning();
      },
    );
