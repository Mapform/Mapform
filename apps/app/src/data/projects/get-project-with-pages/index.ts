"server-only";

import { db } from "@mapform/db";
import { eq, and, isNull } from "@mapform/db/utils";
import { projects, pages, layers, layersToPages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getProjectWithPagesSchema } from "./schema";

export const getProjectWithPages = authAction
  .schema(getProjectWithPagesSchema)
  .action(async ({ parsedInput: { id } }) => {
    // TODO: Cannot use 'with' with geometry columns currently due to Drizzle bug: https://github.com/drizzle-team/drizzle-orm/issues/2526
    // Once fix is merged we can simplify this
    const [_projects2, _pages, _pageLayers] = await Promise.all([
      db.query.projects.findFirst({
        where: and(eq(projects.id, id), isNull(projects.rootProjectId)),
        with: {
          teamspace: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              workspace: {
                columns: {
                  id: true,
                },
              },
            },
          },
          submissionsDataset: {
            columns: {
              id: true,
            },
          },
        },
      }),

      db.query.pages.findMany({
        where: eq(pages.projectId, id),
        columns: {
          id: true,
          title: true,
          position: true,
          center: true,
          zoom: true,
          pitch: true,
          bearing: true,
          contentViewType: true,
        },
        with: {
          layersToPages: {
            with: {
              layer: {
                columns: {
                  id: true,
                  name: true,
                },
              },
            },
            columns: {},
          },
        },
        orderBy: (_pages2, { asc }) => [asc(_pages2.position)],
      }),

      db
        .select({
          name: layers.name,
          type: layers.type,
          layerId: layers.id,
          pageId: layersToPages.pageId,
        })
        .from(layers)
        .leftJoin(layersToPages, eq(layers.id, layersToPages.layerId))
        .leftJoin(pages, eq(layersToPages.pageId, pages.id))
        .leftJoin(projects, eq(pages.projectId, projects.id)),
    ]);

    if (!_projects2) {
      throw new Error("Project not found");
    }

    return {
      ..._projects2,
      pages: _pages,
      pageLayers: _pageLayers,
    };
  });

export type ProjectWithPages = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getProjectWithPages>>>["data"]
>;
