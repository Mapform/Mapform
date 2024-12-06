import { db } from "@mapform/db";
import { eq, and, isNull } from "@mapform/db/utils";
import { projects, pages, layers, layersToPages } from "@mapform/db/schema";
import type { GetProjectWithPagesSchema } from "./schema";

export const getProjectWithPages = async ({
  id,
}: GetProjectWithPagesSchema) => {
  // TODO: Cannot use 'with' with geometry columns currently due to Drizzle bug: https://github.com/drizzle-team/drizzle-orm/issues/2526
  // Once fix is merged we can simplify this
  const [_projects, _pages, _pageLayers] = await Promise.all([
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
      .leftJoin(projects, eq(pages.projectId, projects.id))
      .where(eq(projects.id, id)),
  ]);

  if (!_projects) {
    throw new Error("Project not found");
  }

  return {
    ..._projects,
    pages: _pages,
    pageLayers: _pageLayers,
  };
};

export type ProjectWithPages = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getProjectWithPages>>>
>;
