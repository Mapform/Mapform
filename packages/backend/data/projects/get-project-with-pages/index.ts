"server-only";

import { db } from "@mapform/db";
import { layers, layersToPages, pages, projects } from "@mapform/db/schema";
import { and, eq, inArray, isNull } from "@mapform/db/utils";
import { getProjectWithPagesSchema } from "./schema";
import type {
  UserAuthClient,
  PublicClient,
  UnwrapReturn,
} from "../../../lib/types";

export const getProjectWithPages = (
  authClient: UserAuthClient | PublicClient,
) =>
  authClient
    .schema(getProjectWithPagesSchema)
    .action(async ({ parsedInput: { id }, ctx }) => {
      const [_projects, _pages, _pageLayers] = await Promise.all([
        db.query.projects.findFirst({
          where: and(
            eq(projects.id, id),
            isNull(projects.rootProjectId),
            // Check if the user has access to the project's teamspace
            ctx.authType === "user"
              ? inArray(projects.teamspaceId, ctx.userAccess.teamspace.ids)
              : undefined,
          ),
          with: {
            ending: true,
            teamspace: {
              columns: {
                id: true,
                name: true,
              },
              with: {
                workspace: {
                  columns: {
                    id: true,
                    slug: true,
                  },
                  with: {
                    plan: {
                      columns: {
                        id: true,
                        rowLimit: true,
                      },
                    },
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
    });

export type GetProjectWithPages = UnwrapReturn<typeof getProjectWithPages>;
