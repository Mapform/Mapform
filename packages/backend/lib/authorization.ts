import { UserAuthContext } from "./schema";

export class UserAccess {
  user: UserAuthContext["user"];

  constructor(user: UserAuthContext["user"]) {
    this.user = user;
  }

  get workspace() {
    return {
      bySlug: (slug: string) =>
        this.user.workspaceMemberships.some((wm) => wm.workspace.slug === slug),
      byId: (id: string) =>
        this.user.workspaceMemberships.some((wm) => wm.workspace.id === id),
    };
  }

  get teamspace() {
    return {
      bySlug: (slug: string) =>
        this.user.workspaceMemberships.some((wm) =>
          wm.workspace.teamspaces.some((ts) => ts.slug === slug),
        ),
      byId: (id: string) =>
        this.user.workspaceMemberships.some((wm) =>
          wm.workspace.teamspaces.some((ts) => ts.id === id),
        ),
    };
  }
}

// const checkAccessToWorkspaceBySlug = (slug: string) =>
//   [
//     ...ignoredWorkspaceSlugs,
//     ...response.user.workspaceMemberships.map((wm) => wm.workspace.slug),
//   ].some((ws) => slug === ws);
// const checkAccessToWorkspaceById = (id: string) =>
//   [...response.user.workspaceMemberships.map((wm) => wm.workspace.id)].some(
//     (ws) => id === ws,
//   );
// const hasAccessToCurrentWorkspace = checkAccessToWorkspaceBySlug(workspaceSlug);

// /**
//  * Teamspace slugs are only unique to a WS, therefore we need to check if the
//  * user has access to the requested teamspace in the requested workspace.
//  */
// const checkAccessToTeamspaceBySlug = (tsSlug: string) =>
//   [
//     ...response.user.workspaceMemberships.flatMap((wm) => [
//       ...ignoredTeamspaceSlugs.map((ts) => ({
//         _tsSlug: ts,
//         _wsSlug: wm.workspace.slug,
//       })),
//       ...wm.workspace.teamspaces.map((ts) => ({
//         _tsSlug: ts.slug,
//         _wsSlug: wm.workspace.slug,
//       })),
//     ]),
//   ].some(
//     (ts) => ts._tsSlug === tsSlug && checkAccessToWorkspaceBySlug(ts._wsSlug),
//   );
// const checkAccessToTeamspaceById = (id: string) =>
//   [
//     ...response.user.workspaceMemberships.flatMap((wm) =>
//       wm.workspace.teamspaces.map((ts) => ts.id),
//     ),
//   ].some((ts) => ts === id);
// const hasAccessToTeamspace = checkAccessToTeamspaceBySlug(teamspaceSlug);
