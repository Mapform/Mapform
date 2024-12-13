import {
  createMiddleware,
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import type { AuthContext } from "./lib/schema";
import { ServerError } from "./lib/server-error";
import { Middleware } from "./lib/types";
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

export const createAuthClient = (middleware: Middleware) => {
  const authClient = baseClient.use(middleware);

  return {
    // Auth
    getUser: getUser(authClient),
    requestMagicLink: requestMagicLink(authClient),

    // Workspaces
    getWorkspace: getWorkspace(authClient),
    getWorkspaceDirectory: getWorkspaceDirectory(authClient),
  };
};

export { ServerError, createMiddleware };
export type { AuthContext };
