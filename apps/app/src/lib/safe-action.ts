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
import { getRowAndPageCount } from "@mapform/backend/data/usage/get-row-and-page-count";
import { updateWorkspace } from "@mapform/backend/data/workspaces/update-workspace";
import { upsertCell } from "@mapform/backend/data/cells/upsert-cell";
import { createColumn } from "@mapform/backend/data/columns/create-column";
import { getLayerMarker } from "@mapform/backend/data/datalayer/get-layer-marker";
import { getLayerPoint } from "@mapform/backend/data/datalayer/get-layer-point";
import { getPageData } from "@mapform/backend/data/datalayer/get-page-data";
import { createPoint } from "@mapform/backend/data/datasets/create-point";
import { listTeamspaceDatasets } from "@mapform/backend/data/datasets/list-teamspace-datasets";
import { uploadImage } from "@mapform/backend/data/images/upload-image";
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
import { createCheckoutSession } from "@mapform/backend/data/stripe/create-checkout-session";
import { createBillingSession } from "@mapform/backend/data/stripe/create-billing-session";
import { getStorageUsage } from "@mapform/backend/data/usage/get-storage-usage";
import {
  baseClient,
  UserAccess,
  publicMiddlewareValidator,
  userAuthMiddlewareValidator,
} from "@mapform/backend";
import { headers } from "next/headers";

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

    // Cells
    upsertCell: upsertCell(extendedClient),

    // Columns
    editColumn: editColumn(extendedClient),
    createColumn: createColumn(extendedClient),
    deleteColumn: deleteColumn(extendedClient),

    // Datalayers
    getPageData: getPageData(extendedClient),
    getLayerPoint: getLayerPoint(extendedClient),
    getLayerMarker: getLayerMarker(extendedClient),

    // Datasets
    getDataset: getDataset(extendedClient),
    createPoint: createPoint(extendedClient), // Note: for createUserAuthClient this is causing 'The inferred type of this node exceeds the maximum length the compiler will serialize'
    deleteDataset: deleteDataset(extendedClient),
    updateDataset: updateDataset(extendedClient),
    createEmptyDataset: createEmptyDataset(extendedClient),
    listTeamspaceDatasets: listTeamspaceDatasets(extendedClient),
    createDatasetFromGeojson: createDatasetFromGeojson(extendedClient),

    // Images
    uploadImage: uploadImage(extendedClient),

    // Layers
    upsertLayer: upsertLayer(extendedClient),
    deleteLayer: deleteLayer(extendedClient),
    updateLayerOrder: updateLayerOrder(extendedClient),

    // Layers to Pages
    createPageLayer: createPageLayer(extendedClient),
    deletePageLayer: deletePageLayer(extendedClient),

    // Pages
    createPage: createPage(extendedClient),
    deletePage: deletePage(extendedClient),
    updatePage: updatePage(extendedClient),
    updatePageOrder: updatePageOrder(extendedClient),
    getPageWithLayers: getPageWithLayers(extendedClient),

    // Projects
    createProject: createProject(extendedClient),
    deleteProject: deleteProject(extendedClient),
    updateProject: updateProject(extendedClient),
    publishProject: publishProject(extendedClient),
    getRecentProjects: getRecentProjects(extendedClient),
    getProjectWithPages: getProjectWithPages(extendedClient),

    // Rows
    createRow: createRow(extendedClient),
    deleteRows: deleteRows(extendedClient),
    duplicateRows: duplicateRows(extendedClient),

    // Stripe
    createBillingSession: createBillingSession(extendedClient),
    createCheckoutSession: createCheckoutSession(extendedClient),

    // Teamspaces
    getTeamspaceWithProjects: getTeamspaceWithProjects(extendedClient),

    // Workspaces
    updateWorkspace: updateWorkspace(extendedClient),
    completeOnboarding: completeOnboarding(extendedClient),
    getWorkspaceDirectory: getWorkspaceDirectory(extendedClient),

    // Workspace Memberships
    getUserWorkspaceMemberships: getUserWorkspaceMemberships(extendedClient),

    // Usage
    getRowAndPageCount: getRowAndPageCount(extendedClient),
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

    // Cells
    submitPage: submitPage(extendedClient),

    // Datalayers
    getPageData: getPageData(extendedClient),
    getLayerPoint: getLayerPoint(extendedClient),
    getLayerMarker: getLayerMarker(extendedClient),

    // Rows
    getSession: getSession(extendedClient),
    getResponses: getResponses(extendedClient),
    createSubmission: createSubmission(extendedClient),

    // Projects
    getProjectWithPages: getProjectWithPages(extendedClient),

    // Users
    getCurrentSession: getCurrentSession(extendedClient),
  };
};

export const authClient = createUserAuthClient();
export const publicClient = createPublicClient();
