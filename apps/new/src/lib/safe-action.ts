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
import { getRecentProjects } from "@mapform/backend/data/projects/get-recent-projects";
import { getProject } from "@mapform/backend/data/projects/get-project";
import { createRow } from "@mapform/backend/data/rows/create-row";
import {
  baseClient,
  UserAccess,
  publicMiddlewareValidator,
  userAuthMiddlewareValidator,
} from "@mapform/backend";
import { headers } from "next/headers";
import { updateCurrentUser } from "@mapform/backend/data/users/update-current-user";
import { createProject } from "@mapform/backend/data/projects/create-project";
const ignoredWorkspaceSlugs = ["onboarding"];
const ignoredTeamspaceSlugs = ["settings"];

/**
 * Can be used with user authentication.
 */
const createUserAuthClient = () => {
  const extendedClient = baseClient
    .use(async ({ next }) => {
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
          authType: "user" as const,
          user,
          userAccess,
        },
      });
    })
    .use(userAuthMiddlewareValidator);

  return {
    // Auth
    signOut: signOut(extendedClient),

    // Images
    uploadImage: uploadImage(extendedClient),

    // Projects
    getProject: getProject(extendedClient),
    getRecentProjects: getRecentProjects(extendedClient),
    createProject: createProject(extendedClient),

    // Rows
    createRow: createRow(extendedClient),

    // Stripe
    createBillingSession: createBillingSession(extendedClient),
    createCheckoutSession: createCheckoutSession(extendedClient),

    // Teamspaces
    getTeamspaceWithProjects: getTeamspaceWithProjects(extendedClient),

    // Users
    updateCurrentUser: updateCurrentUser(extendedClient),

    // Workspaces
    updateWorkspace: updateWorkspace(extendedClient),
    completeOnboarding: completeOnboarding(extendedClient),
    getWorkspaceDirectory: getWorkspaceDirectory(extendedClient),

    // Workspace Memberships
    getUserWorkspaceMemberships: getUserWorkspaceMemberships(extendedClient),

    // Usage
    getStorageUsage: getStorageUsage(extendedClient),
  };
};

/**
 * Can be used without authentication.
 */
const createPublicClient = () => {
  const extendedClient = baseClient
    .use(async ({ next }) => next({ ctx: { authType: "public" as const } }))
    .use(publicMiddlewareValidator);

  return {
    // Auth
    requestMagicLink: requestMagicLink(extendedClient),
    validateMagicLink: validateMagicLink(extendedClient),

    // Users
    getCurrentSession: getCurrentSession(extendedClient),
  };
};

export const authClient = createUserAuthClient();
export const publicClient = createPublicClient();
