"server-only";

import { db } from "@mapform/db";
import { verifyToken } from "@mapform/auth/helpers/sessions";
import { publicMiddleware } from "../../../lib/middleware";
import { AuthClient, UnwrapReturn } from "../../../lib/types";
import { getCurrentSessionSchema } from "./schema";
import { users } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";

export const getCurrentSession = (authClient: AuthClient) =>
  authClient
    .use(publicMiddleware)
    .schema(getCurrentSessionSchema)
    .action(async ({ parsedInput: { token } }) => {
      if (!token) {
        return null;
      }

      const sessionData = await verifyToken(token);

      if (!sessionData.user || !sessionData.expires) {
        return null;
      }

      if (new Date(sessionData.expires) < new Date()) {
        return null;
      }

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

      return { user, session: sessionData };
    });

export type GetCurrentSession = UnwrapReturn<typeof getCurrentSession>;
