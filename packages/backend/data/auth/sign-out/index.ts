"server-only";

import { deleteSession } from "@mapform/auth/helpers/sessions";

import type { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const signOut = (authClient: AuthClient) =>
  authClient.use(userAuthMiddleware).action(async () => {
    await deleteSession();
  });
