"server-only";

import { db, sql } from "@mapform/db";
import { embed } from "ai";
import { projects, rows, workspaces, embeddings } from "@mapform/db/schema";
import { searchRowsSchema } from "./schema";
import type { UnwrapReturn, UserAuthClient } from "../../../lib/types";
import { and, cosineDistance, desc, eq, inArray } from "@mapform/db/utils";
import type { Geometry, Point } from "geojson";

export const searchRows = (authClient: UserAuthClient) =>
  authClient
    .schema(searchRowsSchema)
    .action(async ({ parsedInput, ctx: { userAccess } }) => {
      const { query, type } = parsedInput;
      let projectIds: string[] = [];

      if (type === "project") {
        const project = await db.query.projects.findFirst({
          where: eq(projects.id, parsedInput.projectId),
        });

        if (!project) {
          throw new Error("Project not found");
        }

        if (!userAccess.teamspace.checkAccessById(project.teamspaceId)) {
          throw new Error("You are not a member of this project");
        }

        projectIds = [parsedInput.projectId];
      } else if (type === "workspace") {
        // Check workspace access
        if (
          !userAccess.workspace.checkAccessBySlug(parsedInput.workspaceSlug)
        ) {
          throw new Error("You are not a member of this workspace");
        }

        // Get all projects in the workspace
        const workspaceProjects = await db.query.workspaces.findFirst({
          where: eq(workspaces.slug, parsedInput.workspaceSlug),
          with: {
            teamspaces: {
              with: {
                projects: true,
              },
            },
          },
        });

        if (!workspaceProjects) {
          throw new Error("Workspace not found");
        }

        projectIds = workspaceProjects.teamspaces.flatMap((t) =>
          t.projects.map((p) => p.id),
        );
      }

      const { embedding } = await embed({
        model: "text-embedding-3-small",
        value: query.toLowerCase(),
      });

      const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, embedding)})`;

      const embeddingResults = await db
        .selectDistinctOn([rows.id], {
          id: rows.id,
          name: rows.name,
          description: rows.description,
          icon: rows.icon,
          geometry: rows.geometry,
          projectId: rows.projectId,
          projectName: projects.name,
          createdAt: rows.createdAt,
          updatedAt: rows.updatedAt,
          similarity: similarity,
          geometryGeoJSON: sql<Geometry>`ST_AsGeoJSON(${rows.geometry})::jsonb`,
          center: sql<Point>`ST_AsGeoJSON(ST_Centroid(${rows.geometry}))::jsonb`,
        })
        .from(embeddings)
        .innerJoin(rows, eq(embeddings.rowId, rows.id))
        .innerJoin(projects, eq(rows.projectId, projects.id))
        .where(
          and(sql`${similarity} > 0.5`, inArray(rows.projectId, projectIds)),
        )
        .orderBy(rows.id, desc(similarity));

      return embeddingResults;
    });

export type SearchRows = UnwrapReturn<typeof searchRows>;
