"server-only";

import { db } from "@mapform/db";
import { workspaceMemberships } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import type { AuthClient, UnwrapReturn } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";

export const getUserWorkspaceMemberships = (authClient: AuthClient) =>
  authClient.use(userAuthMiddlewareValidator).action(({ ctx: { user } }) => {
    return db.query.workspaceMemberships.findMany({
      where: eq(workspaceMemberships.userId, user.id),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        workspace: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  });

export type GetUserWorkspaceMemberships = UnwrapReturn<
  typeof getUserWorkspaceMemberships
>;
