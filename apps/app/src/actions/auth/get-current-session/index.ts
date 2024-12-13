"server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { verifyToken } from "@mapform/auth/helpers/sessions";
import { users } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { db } from "@mapform/db";

export const getCurrentSession = cache(async () => {
  const sessionCookie = (await cookies()).get("session")?.value ?? null;

  if (!sessionCookie) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie);

  if (!sessionData.user || !sessionData.expires) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  // const user = await authClient.getUser({ id: sesionData.user.id });
  const user = await db.query.users.findFirst({
    where: eq(users.id, sessionData.user.id),
    with: {
      workspaceMemberships: {
        with: {
          workspace: {
            columns: {
              id: true,
              slug: true,
            },
            with: {
              teamspaces: {
                columns: {
                  id: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return { user, session: sessionData };
});

export type GetCurrentSession = ReturnType<typeof getCurrentSession>;
