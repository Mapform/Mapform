"server-only";

import { db } from "@mapform/db";
import { eq, and, inArray } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import { updateProjectSchema } from "./schema";
import { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const updateProject = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(updateProjectSchema)
    .action(async ({ parsedInput: { id, ...rest }, ctx: { user } }) => {
      const teamspaceIds = user.workspaceMemberships
        .map((m) => m.workspace.teamspaces.map((t) => t.id))
        .flat();

      return db
        .update(projects)
        .set(rest)
        .where(
          and(eq(projects.id, id), inArray(projects.teamspaceId, teamspaceIds)),
        )
        .returning();
    });
