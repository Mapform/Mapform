import { redirect } from "next/navigation";
import { getCurrentSession as internalGetCurrentSession } from "~/data/auth/get-current-session";
import { getWorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { requestMagicLink } from "@mapform/backend/data/auth/request-magic-link";
import { validateMagicLink } from "@mapform/backend/data/auth/validate-magic-link";
import { signOut } from "@mapform/backend/data/auth/sign-out";
import { createEmptyDataset } from "@mapform/backend/data/datasets/create-empty-dataset";
import { deleteDataset } from "@mapform/backend/data/datasets/delete-dataset";
import { updateDataset } from "@mapform/backend/data/datasets/update-dataset";
import { createProject } from "@mapform/backend/data/projects/create-project";
import { deleteProject } from "@mapform/backend/data/projects/delete-project";
import { getRecentProjects } from "@mapform/backend/data/projects/get-recent-projects";
import { updateProject } from "@mapform/backend/data/projects/update-project";
import { getUserWorkspaceMemberships } from "@mapform/backend/data/workspace-memberships/get-user-workspace-memberships";
import { countWorkspaceRows } from "@mapform/backend/data/rows/count-workspace-rows";
import { updateWorkspace } from "@mapform/backend/data/workspaces/update-workspace";
import { upsertCell } from "@mapform/backend/data/cells/upsert-cell";
import { createColumn } from "@mapform/backend/data/columns/create-column";
import { getLayerMarker } from "@mapform/backend/data/datalayer/get-layer-marker";
import { getLayerPoint } from "@mapform/backend/data/datalayer/get-layer-point";
import { getPageData } from "@mapform/backend/data/datalayer/get-page-data";
import { createPoint } from "@mapform/backend/data/datasets/create-point";
import { listTeamspaceDatasets } from "@mapform/backend/data/datasets/list-teamspace-datasets";
import { uploadImage } from "@mapform/backend/data/images";
import { createPageLayer } from "@mapform/backend/data/layers-to-pages/create-page-layer";
import { deletePageLayer } from "@mapform/backend/data/layers-to-pages/delete-page-layer";
import { upsertLayer } from "@mapform/backend/data/layers/upsert-layer";
import { deleteLayer } from "@mapform/backend/data/layers/delete-layer";
import { updateLayerOrder } from "@mapform/backend/data/layers/update-layer-order";
import { createPage } from "@mapform/backend/data/pages/create-page";
import { deletePage } from "@mapform/backend/data/pages/delete-page";
import { getPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";
import { updatePage } from "@mapform/backend/data/pages/update-page";
import { updatePageOrder } from "@mapform/backend/data/pages/update-page-order";
import { getProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { getProjectWithTeamspace } from "@mapform/backend/data/projects/get-project-with-teamspace";
import { publishProject } from "@mapform/backend/data/projects/publish-project";
import { getTeamspaceWithProjects } from "@mapform/backend/data/teamspaces/get-teamspace-with-projects";
import { deleteColumn } from "@mapform/backend/data/columns/delete-column";
import { editColumn } from "@mapform/backend/data/columns/edit-column";
import { getDataset } from "@mapform/backend/data/datasets/get-dataset";
import { createRow } from "@mapform/backend/data/rows/create-row";
import { deleteRows } from "@mapform/backend/data/rows/delete-rows";
import { duplicateRows } from "@mapform/backend/data/rows/duplicate-rows";
import { createSubmission } from "@mapform/backend/data/rows/create-submission";
import { getResponses } from "@mapform/backend/data/rows/get-responses";
import { submitPage } from "@mapform/backend/data/cells/submit-page";
import { getSession } from "@mapform/backend/data/rows/get-session";
import { getCurrentSession } from "@mapform/backend/data/auth/get-current-session";
import { createDatasetFromGeojson } from "@mapform/backend/data/datasets/create-from-geojson";
import { completeOnboarding } from "@mapform/backend/data/workspaces/complete-onboarding";
import {
  baseClient,
  PublicAuthContext,
  publicMiddleware,
  UserAuthContext,
  userAuthMiddleware,
} from "@mapform/backend";
import { headers } from "next/headers";

const ignoredWorkspaceSlugs = ["onboarding"];
const ignoredTeamspaceSlugs = ["settings"];

/**
 * Can be used with user authentication.
 */
const createUserAuthClient = (callback: () => Promise<UserAuthContext>) => {
  const authClient = baseClient
    .use(async ({ next }) => {
      // the callback allows the calling service to perform auth checks, and return the necerssary context
      const ctx = await callback();

      return next({
        ctx,
      });
    })
    .use(userAuthMiddleware);

  return {
    // Auth
    signOut: signOut(authClient),

    // Cells
    upsertCell: upsertCell(authClient),

    // Columns
    editColumn: editColumn(authClient),
    createColumn: createColumn(authClient),
    deleteColumn: deleteColumn(authClient),

    // Datalayers
    getPageData: getPageData(authClient),
    getLayerPoint: getLayerPoint(authClient),
    getLayerMarker: getLayerMarker(authClient),

    // Datasets
    getDataset: getDataset(authClient),
    createPoint: createPoint(authClient), // Note: for createUserAuthClient this is causing 'The inferred type of this node exceeds the maximum length the compiler will serialize'
    deleteDataset: deleteDataset(authClient),
    updateDataset: updateDataset(authClient),
    createEmptyDataset: createEmptyDataset(authClient),
    listTeamspaceDatasets: listTeamspaceDatasets(authClient),
    createDatasetFromGeojson: createDatasetFromGeojson(authClient),

    // Images
    uploadImage: uploadImage(authClient),

    // Layers
    upsertLayer: upsertLayer(authClient),
    deleteLayer: deleteLayer(authClient),
    updateLayerOrder: updateLayerOrder(authClient),

    // Layers to Pages
    createPageLayer: createPageLayer(authClient),
    deletePageLayer: deletePageLayer(authClient),

    // Pages
    createPage: createPage(authClient),
    deletePage: deletePage(authClient),
    updatePage: updatePage(authClient),
    updatePageOrder: updatePageOrder(authClient),
    getPageWithLayers: getPageWithLayers(authClient),

    // Projects
    createProject: createProject(authClient),
    deleteProject: deleteProject(authClient),
    updateProject: updateProject(authClient),
    publishProject: publishProject(authClient),
    getRecentProjects: getRecentProjects(authClient),
    getProjectWithPages: getProjectWithPages(authClient),
    getProjectWithTeamspace: getProjectWithTeamspace(authClient),

    // Rows
    createRow: createRow(authClient),
    deleteRows: deleteRows(authClient),
    duplicateRows: duplicateRows(authClient),
    countWorkspaceRows: countWorkspaceRows(authClient),

    // Teamspaces
    getTeamspaceWithProjects: getTeamspaceWithProjects(authClient),

    // Workspaces
    updateWorkspace: updateWorkspace(authClient),
    completeOnboarding: completeOnboarding(authClient),
    getWorkspaceDirectory: getWorkspaceDirectory(authClient),

    // Workspace Memberships
    getUserWorkspaceMemberships: getUserWorkspaceMemberships(authClient),
  };
};

/**
 * Can be used without authentication.
 */
const createPublicClient = (callback: () => Promise<PublicAuthContext>) => {
  const authClient = baseClient
    .use(async ({ next }) => {
      // the callback allows the calling service to perform auth checks, and return the necerssary context
      const ctx = await callback();

      return next({
        ctx,
      });
    })
    .use(publicMiddleware);

  return {
    // Auth
    requestMagicLink: requestMagicLink(authClient),
    validateMagicLink: validateMagicLink(authClient),

    // Cells
    submitPage: submitPage(authClient),

    // Datalayers
    getPageData: getPageData(authClient),
    getLayerPoint: getLayerPoint(authClient),
    getLayerMarker: getLayerMarker(authClient),

    // Rows
    getSession: getSession(authClient),
    getResponses: getResponses(authClient),
    createSubmission: createSubmission(authClient),

    // Projects
    getProjectWithPages: getProjectWithPages(authClient),

    // Users
    getCurrentSession: getCurrentSession(authClient),
  };
};

export const authClient = createUserAuthClient(async () => {
  const headersList = await headers();
  const response = await internalGetCurrentSession();
  const user = response?.data?.user;
  const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
  const teamspaceSlug = headersList.get("x-teamspace-slug") ?? "";

  if (!user) {
    return redirect("/app/signin");
  }

  const workspace = {
    checkAccessBySlug: (slug: string) =>
      user.workspaceMemberships.some((wm) => wm.workspace.slug === slug),

    checkAccessById: (id: string) =>
      user.workspaceMemberships.some((wm) => wm.workspace.id === id),
  };

  const teamspace = {
    ids: user.workspaceMemberships
      .map((m) => m.workspace.teamspaces.map((t) => t.id))
      .flat(),

    checkAccessBySlug: (tsSlug: string, wsSlug: string) =>
      workspace.checkAccessBySlug(wsSlug) &&
      user.workspaceMemberships.some((wm) =>
        wm.workspace.teamspaces.some((ts) => ts.slug === tsSlug),
      ),

    checkAccessById: (id: string) =>
      user.workspaceMemberships.some((wm) =>
        wm.workspace.teamspaces.some((ts) => ts.id === id),
      ),
  };

  const hasAccessToCurrentWorkspace =
    workspace.checkAccessBySlug(workspaceSlug);
  const hasAccessToTeamspace = teamspace.checkAccessBySlug(
    teamspaceSlug,
    workspaceSlug,
  );

  if (workspaceSlug && !hasAccessToCurrentWorkspace) {
    return redirect("/app");
  }

  if (teamspaceSlug && !hasAccessToTeamspace) {
    return redirect(`/app/${workspaceSlug}`);
  }

  return {
    authType: "user",
    user,
    userAccess: {
      workspace,
      teamspace,
    },
  };
});

export const publicClient = createPublicClient(async () => {
  return { authType: "public" };
});

// const checkAccessToWorkspaceBySlug = (slug: string) =>
//   [
//     ...ignoredWorkspaceSlugs,
//     ...response.data!.user!.workspaceMemberships.map(
//       (wm) => wm.workspace.slug,
//     ),
//   ].some((ws) => slug === ws);

// const hasAccessToCurrentWorkspace =
//   checkAccessToWorkspaceBySlug(workspaceSlug);

// const checkAccessToTeamspaceBySlug = (slug: string) =>
//   [
//     ...ignoredTeamspaceSlugs,
//     ...response.data!.user!.workspaceMemberships.flatMap((wm) =>
//       wm.workspace.teamspaces.map((ts) => ts.slug),
//     ),
//   ].some((ts) => slug === ts);

// get workspace() {
//   return {
//     checkAccessBySlug: (slug: string) =>
//       this.user.workspaceMemberships.some((wm) => wm.workspace.slug === slug),

//     checkAccessById: (id: string) =>
//       this.user.workspaceMemberships.some((wm) => wm.workspace.id === id),
//   };
// }

// get teamspace() {
//   return {
//     ids: this.user.workspaceMemberships
//       .map((m) => m.workspace.teamspaces.map((t) => t.id))
//       .flat(),

//     checkAccessBySlug: (tsSlug: string, wsSlug: string) =>
//       this.workspace.checkAccessBySlug(wsSlug) &&
//       this.user.workspaceMemberships.some((wm) =>
//         wm.workspace.teamspaces.some((ts) => ts.slug === tsSlug),
//       ),

//     checkAccessById: (id: string) =>
//       this.user.workspaceMemberships.some((wm) =>
//         wm.workspace.teamspaces.some((ts) => ts.id === id),
//       ),
//   };
// }
