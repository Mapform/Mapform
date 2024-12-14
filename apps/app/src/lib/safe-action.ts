import { redirect } from "next/navigation";
import { getCurrentSession } from "~/actions/auth/get-current-session";
import { createUserAuthClient, createPublicClient } from "@mapform/backend";
import { headers } from "next/headers";

const ignoredWorkspaceSlugs = ["onboarding"];
const ignoredTeamspaceSlugs = ["settings"];

export const authClient = createUserAuthClient(async () => {
  const headersList = await headers();
  const response = await getCurrentSession();
  const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
  const teamspaceSlug = headersList.get("x-teamspace-slug") ?? "";

  if (!response?.user) {
    return redirect("/app/signin");
  }

  const checkAccessToWorkspaceBySlug = (slug: string) =>
    [
      ...ignoredWorkspaceSlugs,
      ...response.user.workspaceMemberships.map((wm) => wm.workspace.slug),
    ].some((ws) => slug === ws);

  const hasAccessToCurrentWorkspace =
    checkAccessToWorkspaceBySlug(workspaceSlug);

  /**
   * Teamspace slugs are only unique to a WS, therefore we need to check if the
   * user has access to the requested teamspace in the requested workspace.
   */
  const checkAccessToTeamspaceBySlug = (tsSlug: string) =>
    [
      ...response.user.workspaceMemberships.flatMap((wm) => [
        ...ignoredTeamspaceSlugs.map((ts) => ({
          _tsSlug: ts,
          _wsSlug: wm.workspace.slug,
        })),
        ...wm.workspace.teamspaces.map((ts) => ({
          _tsSlug: ts.slug,
          _wsSlug: wm.workspace.slug,
        })),
      ]),
    ].some(
      (ts) => ts._tsSlug === tsSlug && checkAccessToWorkspaceBySlug(ts._wsSlug),
    );

  const hasAccessToTeamspace = checkAccessToTeamspaceBySlug(teamspaceSlug);

  if (workspaceSlug && !hasAccessToCurrentWorkspace) {
    return redirect("/app");
  }

  if (teamspaceSlug && !hasAccessToTeamspace) {
    return redirect(`/app/${workspaceSlug}`);
  }

  return { authType: "user", user: response.user };
});

export const publicClient = createPublicClient(async () => {
  console.log("Calling public client");
  return { authType: "public" };
});
