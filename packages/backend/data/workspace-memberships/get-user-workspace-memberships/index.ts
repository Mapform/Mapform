"server-only";

import { db } from "@mapform/db";
import { workspaceMemberships } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const getUserWorkspaceMemberships = (authClient: UserAuthClient) =>
  authClient.action(({ ctx: { user } }) => {
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
