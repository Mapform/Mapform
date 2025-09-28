import { redirect } from "next/navigation";
import { getCurrentSession as internalGetCurrentSession } from "~/data/auth/get-current-session";
import { getWorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { requestMagicLink } from "@mapform/backend/data/auth/request-magic-link";
import { validateMagicLink } from "@mapform/backend/data/auth/validate-magic-link";
import { signOut } from "@mapform/backend/data/auth/sign-out";
import { getUserWorkspaceMemberships } from "@mapform/backend/data/workspace-memberships/get-user-workspace-memberships";
import { updateWorkspace } from "@mapform/backend/data/workspaces/update-workspace";
import { uploadImage } from "@mapform/backend/data/images/upload-image";
import { getTeamspaceWithProjects } from "@mapform/backend/data/teamspaces/get-teamspace-with-projects";
import { getCurrentSession } from "@mapform/backend/data/auth/get-current-session";
import { completeOnboarding } from "@mapform/backend/data/workspaces/complete-onboarding";
import { createCheckoutSession } from "@mapform/backend/data/stripe/create-checkout-session";
import { createBillingSession } from "@mapform/backend/data/stripe/create-billing-session";
import { getStorageUsage } from "@mapform/backend/data/usage/get-storage-usage";
import { getProject } from "@mapform/backend/data/projects/get-project";
import { createRow } from "@mapform/backend/data/rows/create-row";
import { getRow } from "@mapform/backend/data/rows/get-row";
import {
  baseClient,
  UserAccess,
  publicMiddlewareValidator,
  userAuthMiddlewareValidator,
} from "@mapform/backend";
import { headers } from "next/headers";
import { updateCurrentUser } from "@mapform/backend/data/users/update-current-user";
import { createProject } from "@mapform/backend/data/projects/create-project";
import { createView } from "@mapform/backend/data/views/create-view";
import { createRows } from "@mapform/backend/data/rows/create-rows";
import { deleteRows } from "@mapform/backend/data/rows/delete-rows";
import { duplicateRows } from "@mapform/backend/data/rows/duplicate-rows";
import { deleteView } from "@mapform/backend/data/views/delete-view";
import { updateView } from "@mapform/backend/data/views/update-view";
import { createColumn } from "@mapform/backend/data/columns/create-column";
import { deleteColumn } from "@mapform/backend/data/columns/delete-column";
import { updateColumn } from "@mapform/backend/data/columns/update-column";
import { upsertCell } from "@mapform/backend/data/cells/upsert-cell";
import { searchRows } from "@mapform/backend/data/rows/search-rows";
import { updateRow } from "@mapform/backend/data/rows/update-row";
import { updateProject } from "@mapform/backend/data/projects/update-project";
import { updateProjectOrder } from "@mapform/backend/data/projects/update-project-order";
import { deleteProject } from "@mapform/backend/data/projects/delete-project";
import { createChat } from "@mapform/backend/data/chats/create-chat";
import { getChat } from "@mapform/backend/data/chats/get-chat";
import { createMessages } from "@mapform/backend/data/messages/create-messages";
import { getMessages } from "@mapform/backend/data/messages/get-messages";
import { listChats } from "@mapform/backend/data/chats/list-chats";
import { getRowCount } from "@mapform/backend/data/usage/get-row-count";
import { getAiTokenUsage } from "@mapform/backend/data/usage/get-ai-token-usage";
import { incrementAiTokenUsage } from "@mapform/backend/data/usage/increment-ai-token-usage";
import { deleteChat } from "@mapform/backend/data/chats/delete-chat";
import { search } from "@mapform/backend/data/stadia/search";
import { details } from "@mapform/backend/data/stadia/details";
import { reverseGeocode } from "@mapform/backend/data/stadia/reverse";
import { forwardGeocode } from "@mapform/backend/data/stadia/forward";
import { updateColumnOrder } from "@mapform/backend/data/columns/update-column-order";
import { db } from "@mapform/db";
import { updateChat } from "@mapform/backend/data/chats/update-chat";
import { deleteImage } from "@mapform/backend/data/images/delete-image";

const ignoredWorkspaceSlugs = ["onboarding"];
const ignoredTeamspaceSlugs = ["settings"];

export const authClient = baseClient
  .use(async ({ next, ctx }) => {
    const headersList = await headers();
    const response = await internalGetCurrentSession();
    const user = response?.data?.user;
    const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
    const teamspaceSlug = headersList.get("x-teamspace-slug") ?? "";

    if (!user) {
      return redirect("/app/signin");
    }

    const userAccess = new UserAccess(user);

    const hasAccessToCurrentWorkspace =
      userAccess.workspace.checkAccessBySlug(workspaceSlug);
    const hasAccessToTeamspace = userAccess.teamspace.checkAccessBySlug(
      teamspaceSlug,
      workspaceSlug,
    );

    if (
      workspaceSlug &&
      !hasAccessToCurrentWorkspace &&
      !ignoredWorkspaceSlugs.includes(workspaceSlug)
    ) {
      return redirect("/app");
    }

    if (
      teamspaceSlug &&
      !hasAccessToTeamspace &&
      !ignoredTeamspaceSlugs.includes(teamspaceSlug)
    ) {
      return redirect(`/app/${workspaceSlug}`);
    }

    return next({
      ctx: {
        ...ctx,
        authType: "user" as const,
        user,
        userAccess,
      },
    });
  })
  .use(userAuthMiddlewareValidator);

/**
 * Can be used with user authentication.
 */
const createUserAuthDataService = () => {
  const extendedClient = authClient;

  // Allow passing a custom client (e.g., one bound to a transaction)
  const createClient = (client: typeof extendedClient) => ({
    // Auth
    signOut: signOut(client),

    // Cells
    upsertCell: upsertCell(client),

    // Chats
    createChat: createChat(client),
    deleteChat: deleteChat(client),
    getChat: getChat(client),
    listChats: listChats(client),
    updateChat: updateChat(client),

    // Columns
    createColumn: createColumn(client),
    deleteColumn: deleteColumn(client),
    updateColumn: updateColumn(client),
    updateColumnOrder: updateColumnOrder(client),

    // Images
    uploadImage: uploadImage(client),
    deleteImage: deleteImage(client),

    // Messages
    createMessages: createMessages(client),
    getMessages: getMessages(client),

    // Projects
    getProject: getProject(client),
    createProject: createProject(client),
    updateProject: updateProject(client),
    updateProjectOrder: updateProjectOrder(client),
    deleteProject: deleteProject(client),

    // Rows
    getRow: getRow(client),
    createRow: createRow(client),
    updateRow: updateRow(client),
    createRows: createRows(client),
    deleteRows: deleteRows(client),
    duplicateRows: duplicateRows(client),
    searchRows: searchRows(client),

    // Stripe
    createBillingSession: createBillingSession(client),
    createCheckoutSession: createCheckoutSession(client),

    // Teamspaces
    getTeamspaceWithProjects: getTeamspaceWithProjects(client),

    // Users
    updateCurrentUser: updateCurrentUser(client),

    // Views
    createView: createView(client),
    deleteView: deleteView(client),
    updateView: updateView(client),

    // Workspaces
    updateWorkspace: updateWorkspace(client),
    completeOnboarding: completeOnboarding(client),
    getWorkspaceDirectory: getWorkspaceDirectory(client),

    // Workspace Memberships
    getUserWorkspaceMemberships: getUserWorkspaceMemberships(client),

    // Usage
    getStorageUsage: getStorageUsage(client),
    getRowCount: getRowCount(client),
    getAiTokenUsage: getAiTokenUsage(client),
    incrementAiTokenUsage: incrementAiTokenUsage(client),
  });

  return {
    $transaction: <R>(
      fn: (
        transactionClient: ReturnType<typeof createClient>,
      ) => Promise<R> | R,
    ): Promise<R> => {
      return db.transaction(async (tx) => {
        // Bind a client whose ctx.db is the transaction
        const transactionalClient = extendedClient.use(
          async ({ next, ctx }) => {
            return next({ ctx: { ...ctx, db: tx } });
          },
        );

        return fn(createClient(transactionalClient));
      });
    },
    ...createClient(extendedClient),
    authClient,
  };
};
export const authDataService = createUserAuthDataService();

export const publicClient = baseClient
  .use(async ({ next }) => next({ ctx: { authType: "public" as const } }))
  .use(publicMiddlewareValidator);

export const publicDataService = {
  // Auth
  requestMagicLink: requestMagicLink(publicClient),
  validateMagicLink: validateMagicLink(publicClient),

  // Stadia
  search: search(publicClient),
  details: details(publicClient),
  reverseGeocode: reverseGeocode(publicClient),
  forwardGeocode: forwardGeocode(publicClient),

  // Users
  getCurrentSession: getCurrentSession(publicClient),
};
