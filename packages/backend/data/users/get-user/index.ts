"server-only";

import { db } from "@mapform/db";
import { users } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { getUserSchema } from "./schema";
import type { AuthClient, UnwrapReturn } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const getUser = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(getUserSchema)
    .action(({ parsedInput: { id }, ctx: { user } }) => {
      if (id !== user.id) {
        throw new Error("You can only get your own user");
      }

      return db.query.users.findFirst({
        where: eq(users.id, id),
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
    });

export type GetUser = UnwrapReturn<typeof getUser>;
