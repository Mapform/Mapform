import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import type { AuthContext } from "./lib/schema";
import { ServerError } from "./lib/server-error";
import { getWorkspaceDirectory } from "./data/workspaces/get-workspace-directory";
import { requestMagicLink } from "./data/auth/request-magic-link";
import { validateMagicLink } from "./data/auth/validate-magic-link";
import { signOut } from "./data/auth/sign-out";
import { createEmptyDataset } from "./data/datasets/create-empty-dataset";

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
    // the callback allows the service to perform auth checks, and return the necerssary context
    const ctx = await callback();

    return next({
      ctx,
    });
  });

  return {
    // Auth
    signOut: signOut(authClient),

    // Datasets
    createEmptyDataset: createEmptyDataset(authClient),

    // Workspaces
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
    // the callback allows the service to perform auth checks, and return the necerssary context
    const ctx = await callback();

    return next({
      ctx,
    });
  });

  return {
    // Auth
    requestMagicLink: requestMagicLink(authClient),
    validateMagicLink: validateMagicLink(authClient),
  };
};

export { ServerError, createUserAuthClient, createPublicClient };
export type { AuthContext };
