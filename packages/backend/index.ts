import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import type { AuthContext } from "./lib/schema";
import { ServerError } from "./lib/server-error";
import { getWorkspace } from "./data/workspaces/get-workspace";
import { getWorkspaceDirectory } from "./data/workspaces/get-workspace-directory";
import { getUser } from "./data/users/get-user";
import { requestMagicLink } from "./data/auth/request-magic-link";

// Base client
export const baseClient = createSafeActionClient({
  handleServerError(e) {
    // Log to console.
    console.error("Action error:", e.message);

    // In this case, we can use the 'MyCustomError` class to unmask errors
    // and return them with their actual messages to the client.
    if (e instanceof ServerError) {
      return e.message;
    }

    // Every other error that occurs will be masked with the default message.
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

/**
 * Can be used with user authentication.
 */
const createUserAuthClient = (
  callback: () => Promise<Extract<AuthContext, { authType: "user" }>>,
) => {
  const authClient = baseClient.use(async ({ next }) => {
    const ctx = await callback();

    return next({
      ctx,
    });
  });

  return {
    // Users
    getUser: getUser(authClient),

    // Workspaces
    getWorkspace: getWorkspace(authClient),
    getWorkspaceDirectory: getWorkspaceDirectory(authClient),
  };
};

/**
 * Can be used without authentication.
 */
const createPublicClient = (
  callback: () => Promise<Extract<AuthContext, { authType: "public" }>>,
) => {
  const authClient = baseClient.use(async ({ next }) => {
    const ctx = await callback();

    return next({
      ctx,
    });
  });

  return {
    // Auth
    requestMagicLink: requestMagicLink(authClient),
  };
};

export { ServerError, createUserAuthClient, createPublicClient };
export type { AuthContext };
