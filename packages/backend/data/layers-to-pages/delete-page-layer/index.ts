"server-only";

import { db } from "@mapform/db";
import { layersToPages } from "@mapform/db/schema";
import { eq, and, gt, sql } from "@mapform/db/utils";
import { deletePageLayerSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const deletePageLayer = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(deletePageLayerSchema)
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

        await db.transaction(async (tx) => {
          await tx
            .delete(layersToPages)
            .where(
              and(
                eq(layersToPages.layerId, layerId),
                eq(layersToPages.pageId, pageId),
              ),
            );

          // We now need to update the position of the remaining layersToPosition
          await Promise.all(
            existingPageLayers.map(async (ltp) => {
              const positionThatWasDeleted = ltp.position;

              return db
                .update(layersToPages)
                .set({
                  position: sql`${layersToPages.position} - 1`,
                })
                .where(
                  and(
                    eq(layersToPages.pageId, pageId),
                    gt(layersToPages.position, positionThatWasDeleted),
                  ),
                );
            }),
          );
        });
      },
    );
