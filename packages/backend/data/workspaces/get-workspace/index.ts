"server-only";

import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { getWorkspaceSchema } from "./schema";
import type { AuthClient, UnwrapReturn } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const getWorkspace = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(getWorkspaceSchema)
    .action(({ parsedInput }) => {
      return db.query.workspaces.findFirst({
        where: eq(workspaces.slug, parsedInput.slug),
      });
    });

export type Workspace = UnwrapReturn<typeof getWorkspace>;
