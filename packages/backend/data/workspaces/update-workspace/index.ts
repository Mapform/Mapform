"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { workspaces } from "@mapform/db/schema";
import { catchError } from "@mapform/lib/catch-error";
import { updateWorkspaceSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { ServerError } from "../../../lib/server-error";

export const updateWorkspace = (authClient: UserAuthClient) =>
  authClient
    .schema(updateWorkspaceSchema)
    .action(async ({ parsedInput: { id, ...rest }, ctx: { userAccess } }) => {
      if (!userAccess.workspace.checkAccessById(id)) {
        throw new Error("Unauthorized");
      }

      const [error, workspace] = await catchError(
        db
          .update(workspaces)
          .set(rest)
          .where(eq(workspaces.id, id))
          .returning(),
      );

      if (error) {
        if ((error as unknown as { code: string }).code === "23505") {
          throw new ServerError({
            message: "Workspace slug already exists",
          });
        }
        throw error;
      }

      return workspace;
    });
