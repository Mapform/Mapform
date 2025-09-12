"server-only";

import { db, sql } from "@mapform/db";
import { eq, and, inArray } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import { updateProjectSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const updateProject = (authClient: UserAuthClient) =>
  authClient
    .schema(updateProjectSchema)
    .action(async ({ parsedInput: { id, center, ...rest }, ctx: { user } }) => {
      const teamspaceIds = user.workspaceMemberships
        .map((m) => m.workspace.teamspaces.map((t) => t.id))
        .flat();

      return db
        .update(projects)
        .set({
          ...rest,
          ...(center && {
            center: sql.raw(`ST_GeomFromGeoJSON('{
          "type": "Point",
          "coordinates": ${JSON.stringify(center.coordinates)}
        }')`),
          }),
        })
        .where(
          and(eq(projects.id, id), inArray(projects.teamspaceId, teamspaceIds)),
        )
        .returning();
    });
