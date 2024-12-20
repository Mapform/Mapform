"server-only";

import { db } from "@mapform/db";
import { layersToPages, pages, projects } from "@mapform/db/schema";
import { eq, and, gt, sql } from "@mapform/db/utils";
import { notEmpty } from "@mapform/lib/not-empty";
import { deletePageLayerSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const deletePageLayer = (authClient: UserAuthClient) =>
  authClient
    .schema(deletePageLayerSchema)
    .action(
      async ({ parsedInput: { layerId, pageId }, ctx: { userAccess } }) => {
        const results = await db
          .select()
          .from(layersToPages)
          .leftJoin(pages, eq(pages.id, layersToPages.pageId))
          .leftJoin(projects, eq(projects.id, pages.projectId))
          .where(
            and(
              eq(layersToPages.layerId, layerId),
              eq(layersToPages.pageId, pageId),
            ),
          );

        const ltpTeamspaceIds = results
          .map((result) => result.project?.teamspaceId)
          .filter(notEmpty);

        if (
          ltpTeamspaceIds.some(
            (teamspaceId) => !userAccess.teamspace.ids.includes(teamspaceId),
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
            results.map(async (result) => {
              const positionThatWasDeleted = result.layers_to_pages.position;

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
