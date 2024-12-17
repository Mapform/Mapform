"server-only";

import { deleteSession } from "@mapform/auth/helpers/sessions";

import type { UserAuthClient } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";

export const signOut = (authClient: UserAuthClient) =>
  authClient.use(userAuthMiddlewareValidator).action(async () => {
    await deleteSession();
  });
