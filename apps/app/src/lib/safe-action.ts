import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";

// Base client
export const baseClient = createSafeActionClient();

/**
 * Check that the user is authenticated, and only requested workspace /
 * teamspace resources they have access to.
 */
export const authAction = baseClient.use(async ({ next }) => {
  const response = await getCurrentSession();
  const headersList = await headers();
  const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
  const teamspaceSlug = headersList.get("x-teamspace-slug") ?? "";

  if (!response?.user) {
    return redirect("/app/signin");
  }

  const checkAccessToWorkspaceBySlug = (slug: string) =>
    [...response.user.workspaceMemberships.map((wm) => wm.workspace.slug)].some(
      (ws) => slug === ws,
    );
  const checkAccessToWorkspaceById = (id: string) =>
    [...response.user.workspaceMemberships.map((wm) => wm.workspace.id)].some(
      (ws) => id === ws,
    );
  const hasAccessToCurrentWorkspace =
    checkAccessToWorkspaceBySlug(workspaceSlug);

  /**
   * Teamspace slugs are only unique to a WS, therefore we need to check if the
   * user has access to the requested teamspace in the requested workspace.
   */
  const checkAccessToTeamspaceBySlug = (tsSlug: string) =>
    [
      ...response.user.workspaceMemberships.flatMap((wm) =>
        wm.workspace.teamspaces.map((ts) => ({
          _tsSlug: ts.slug,
          _wsSlug: wm.workspace.slug,
        })),
      ),
    ].some(
      (ts) => ts._tsSlug === tsSlug && checkAccessToWorkspaceBySlug(ts._wsSlug),
    );
  const checkAccessToTeamspaceById = (id: string) =>
    [
      ...response.user.workspaceMemberships.flatMap((wm) =>
        wm.workspace.teamspaces.map((ts) => ts.id),
      ),
    ].some((ts) => ts === id);
  const hasAccessToTeamspace = checkAccessToTeamspaceBySlug(teamspaceSlug);

  if (workspaceSlug && !hasAccessToCurrentWorkspace) {
    return redirect("/app");
  }

  if (teamspaceSlug && !hasAccessToTeamspace) {
    return redirect(`/app/${workspaceSlug}`);
  }

  return next({
    ctx: {
      user: response.user,
      session: response.session,
      checkAccessToWorkspaceBySlug,
      checkAccessToTeamspaceBySlug,
      checkAccessToTeamspaceById,
      checkAccessToWorkspaceById,
    },
  });
});

/**
 * We can place explicit checks for the share client here.
 */
export const shareClient = baseClient.use(({ next }) => next());
