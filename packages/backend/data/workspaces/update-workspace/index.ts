"server-only";

import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { updateWorkspaceSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const updateWorkspace = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(updateWorkspaceSchema)
    .action(({ parsedInput: { id, ...rest }, ctx: { userAccess } }) => {
      if (!userAccess.workspace.checkAccessById(id)) {
        throw new Error("Unauthorized");
      }

      return db.transaction(async (tx) => {
        return tx
          .update(workspaces)
          .set(rest)
          .where(eq(workspaces.id, id))
          .returning();
      });
    });
