import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";
import { createUserAuthClient, createPublicClient } from "@mapform/backend";

export const authClient = createUserAuthClient(async () => {
  const response = await getCurrentSession();

  if (!response?.user) {
    return redirect("/app/signin");
  }

  return { authType: "user", user: response.user };
});

export const publicClient = createPublicClient(async () => {
  console.log("Calling public client");
  return { authType: "public" };
});

// These represent routes that are not really workspace or teamspace.
// const ignoredWorkspaceSlugs = ["onboarding"];
// const ignoredTeamspaceSlugs = ["settings"];

// // Base client
// export const baseClient = createSafeActionClient({
//   handleServerError(e) {
//     // Log to console.
//     console.error("Action error:", e.message);

//     // In this case, we can use the 'MyCustomError` class to unmask errors
//     // and return them with their actual messages to the client.
//     if (e instanceof ServerError) {
//       return e.message;
//     }

//     // Every other error that occurs will be masked with the default message.
//     return DEFAULT_SERVER_ERROR_MESSAGE;
//   },
// });

// /**
//  * Check that the user is authenticated, and only requested workspace /
//  * teamspace resources they have access to.
//  *
//  * NOTE: This is a first-level service check, but authorization checks must also
//  * happen at the data access layer.
//  */
// export const authAction = baseClient.use(async ({ next }) => {
//   const response = await getCurrentSession();
//   const headersList = await headers();
//   const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
//   const teamspaceSlug = headersList.get("x-teamspace-slug") ?? "";

// if (!response?.user) {
//   return redirect("/app/signin");
// }

//   const checkAccessToWorkspaceBySlug = (slug: string) =>
//     [
//       ...ignoredWorkspaceSlugs,
//       ...response.user.workspaceMemberships.map((wm) => wm.workspace.slug),
//     ].some((ws) => slug === ws);
//   const checkAccessToWorkspaceById = (id: string) =>
//     [...response.user.workspaceMemberships.map((wm) => wm.workspace.id)].some(
//       (ws) => id === ws,
//     );
//   const hasAccessToCurrentWorkspace =
//     checkAccessToWorkspaceBySlug(workspaceSlug);

//   /**
//    * Teamspace slugs are only unique to a WS, therefore we need to check if the
//    * user has access to the requested teamspace in the requested workspace.
//    */
//   const checkAccessToTeamspaceBySlug = (tsSlug: string) =>
//     [
//       ...response.user.workspaceMemberships.flatMap((wm) => [
//         ...ignoredTeamspaceSlugs.map((ts) => ({
//           _tsSlug: ts,
//           _wsSlug: wm.workspace.slug,
//         })),
//         ...wm.workspace.teamspaces.map((ts) => ({
//           _tsSlug: ts.slug,
//           _wsSlug: wm.workspace.slug,
//         })),
//       ]),
//     ].some(
//       (ts) => ts._tsSlug === tsSlug && checkAccessToWorkspaceBySlug(ts._wsSlug),
//     );
//   const checkAccessToTeamspaceById = (id: string) =>
//     [
//       ...response.user.workspaceMemberships.flatMap((wm) =>
//         wm.workspace.teamspaces.map((ts) => ts.id),
//       ),
//     ].some((ts) => ts === id);
//   const hasAccessToTeamspace = checkAccessToTeamspaceBySlug(teamspaceSlug);

//   if (workspaceSlug && !hasAccessToCurrentWorkspace) {
//     return redirect("/app");
//   }

//   if (teamspaceSlug && !hasAccessToTeamspace) {
//     return redirect(`/app/${workspaceSlug}`);
//   }

//   return next({
//     ctx: {
//       user: response.user,
//       session: response.session,
//       checkAccessToWorkspaceBySlug,
//       checkAccessToTeamspaceBySlug,
//       checkAccessToTeamspaceById,
//       checkAccessToWorkspaceById,
//       workspaceSlug,
//       teamspaceSlug,
//     },
//   });
// });

// /**
//  * We can place explicit checks for the share client here.
//  */
// export const shareClient = baseClient.use(({ next }) => next());
