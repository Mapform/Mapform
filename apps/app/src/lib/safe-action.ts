import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";

// Base client
export const actionClient = createSafeActionClient();

// Exceptions for workspace and teamspace slugs because they are also positional params
const workspaceExceptions = ["signin", "signup", "onboarding"];
const teamspaceExceptions = ["settings"];

/**
 * Check that the user is authenticated, and only requested workspace /
 * teamspace resources they have access to.
 */
export const authAction = actionClient.use(async ({ next }) => {
  const response = await getCurrentSession();
  const headersList = await headers();
  const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
  const teamspaceSlug = headersList.get("x-teamspace-slug") ?? "";

  if (!response?.user) {
    return redirect("/signin");
  }

  const hasAccessToWorkspace = [
    ...workspaceExceptions,
    ...response.user.workspaceMemberships.map((wm) => wm.workspace.slug),
  ].some((ws) => workspaceSlug === ws);

  const hasAccessToTeamspace = [
    ...teamspaceExceptions,
    ...response.user.workspaceMemberships.flatMap((wm) =>
      wm.workspace.teamspaces.map((ts) => ts.slug),
    ),
  ].some((ts) => ts === teamspaceSlug);

  if (workspaceSlug && !hasAccessToWorkspace) {
    return redirect("/");
  }

  if (teamspaceSlug && !hasAccessToTeamspace) {
    return redirect(`/${workspaceSlug}`);
  }

  return next({ ctx: { user: response.user, session: response.session } });
});
