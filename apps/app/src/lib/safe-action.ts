import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";

// Base client
export const actionClient = createSafeActionClient();

/**
 * Check that the user is authenticated
 */
export const authAction = actionClient.use(async ({ next }) => {
  const response = await getCurrentSession();
  const headersList = await headers();
  const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
  const teamspaceSlug = headersList.get("x-teamspace-slug") ?? "";

  if (!response?.user) {
    return redirect("/signin");
  }

  const hasAccessToWorkspace = response.user.workspaceMemberships.some(
    (wm) => workspaceSlug === wm.workspace.slug,
  );

  const hasAccessToTeamspace = response.user.workspaceMemberships.some((wm) =>
    wm.workspace.teamspaces.some((ts) => ts.slug === teamspaceSlug),
  );

  if (workspaceSlug && !hasAccessToWorkspace) {
    return redirect("/");
  }

  if (teamspaceSlug && !hasAccessToTeamspace) {
    return redirect(`/${workspaceSlug}`);
  }

  return next({ ctx: { user: response.user, session: response.session } });
});
