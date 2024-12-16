"server-only";

import { deleteSession } from "@mapform/auth/helpers/sessions";

import type { UserAuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const signOut = (authClient: UserAuthClient) =>
  authClient.use(userAuthMiddleware).action(async () => {
    await deleteSession();
  });
