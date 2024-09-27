"server-only";

import { db } from "@mapform/db";
import { workspaceMemberships } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { authAction } from "~/lib/safe-action";

export const getCurrentUserWorkspaceMemberships = authAction.action(
  ({ ctx: { userId } }) => {
    return db.query.workspaceMemberships.findMany({
      where: eq(workspaceMemberships.userId, userId),
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
  }
);

export type CurrentUserWorkspaceMemberships = NonNullable<
  Awaited<ReturnType<typeof getCurrentUserWorkspaceMemberships>>
>["data"];
