import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import type { AuthContext } from "./lib/schema";
import { ServerError } from "./lib/server-error";
import { getWorkspaceDirectory } from "./data/workspaces/get-workspace-directory";
import { requestMagicLink } from "./data/auth/request-magic-link";
import { validateMagicLink } from "./data/auth/validate-magic-link";
import { signOut } from "./data/auth/sign-out";
import { createEmptyDataset } from "./data/datasets/create-empty-dataset";
import { deleteDataset } from "./data/datasets/delete-dataset";
import { updateDataset } from "./data/datasets/update-dataset";
import { createProject } from "./data/projects/create-project";
import { deleteProject } from "./data/projects/delete-project";
import { getRecentProjects } from "./data/projects/get-recent-projects";
import { updateProject } from "./data/projects/update-project";
import { getUserWorkspaceMemberships } from "./data/workspace-memberships/get-user-workspace-memberships";
import { countWorkspaceRows } from "./data/rows/count-workspace-rows";
import { updateWorkspace } from "./data/workspaces/update-workspace";
import { upsertCell } from "./data/cells/upsert-cell";
import { createColumn } from "./data/columns/create-column";
import { getLayerMarker } from "./data/datalayer/get-layer-marker";
import { getLayerPoint } from "./data/datalayer/get-layer-point";
import { getPageData } from "./data/datalayer/get-page-data";
import { createPoint } from "./data/datasets/create-point";
import { listTeamspaceDatasets } from "./data/datasets/list-teamspace-datasets";
import { uploadImage } from "./data/images";
import { createPageLayer } from "./data/layers-to-pages/create-page-layer";
import { deletePageLayer } from "./data/layers-to-pages/delete-page-layer";

// Base client
export const baseClient = createSafeActionClient({
  handleServerError(e) {
    // Log to console.
    console.error("Action error:", e.message);

    // In this case, we can use the 'MyCustomError` class to unmask errors
    // and return them with their actual messages to the client.
    if (e instanceof ServerError) {
      return e.message;
    }

    // Every other error that occurs will be masked with the default message.
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

/**
 * Can be used with user authentication.
 */
const createUserAuthClient = (
  callback: () => Promise<Extract<AuthContext, { authType: "user" }>>,
) => {
  const authClient = baseClient.use(async ({ next }) => {
    // the callback allows the service to perform auth checks, and return the necerssary context
    const ctx = await callback();

    return next({
      ctx,
    });
  });

  return {
    // Auth
    signOut: signOut(authClient),

    // Cells
    upsertCell: upsertCell(authClient),

    // Columns
    createColumn: createColumn(authClient),

    // Datalayers
    getPageData: getPageData(authClient),
    getLayerPoint: getLayerPoint(authClient),
    getLayerMarker: getLayerMarker(authClient),

    // Datasets
    createPoint: createPoint(authClient), // Note: for createUserAuthClient this is causing 'The inferred type of this node exceeds the maximum length the compiler will serialize'
    deleteDataset: deleteDataset(authClient),
    updateDataset: updateDataset(authClient),
    createEmptyDataset: createEmptyDataset(authClient),
    listTeamspaceDatasets: listTeamspaceDatasets(authClient),

    // Images
    uploadImage: uploadImage(authClient),

    // Layers to Pages
    createPageLayer: createPageLayer(authClient),
    deletePageLayer: deletePageLayer(authClient),

    // Projects
    createProject: createProject(authClient),
    deleteProject: deleteProject(authClient),
    updateProject: updateProject(authClient),
    getRecentProjects: getRecentProjects(authClient),

    // Rows
    countWorkspaceRows: countWorkspaceRows(authClient),

    // Workspaces
    updateWorkspace: updateWorkspace(authClient),
    getWorkspaceDirectory: getWorkspaceDirectory(authClient),

    // Workspace Memberships
    getUserWorkspaceMemberships: getUserWorkspaceMemberships(authClient),
  };
};

/**
 * Can be used without authentication.
 */
const createPublicClient = (
  callback: () => Promise<Extract<AuthContext, { authType: "public" }>>,
) => {
  const authClient = baseClient.use(async ({ next }) => {
    // the callback allows the service to perform auth checks, and return the necerssary context
    const ctx = await callback();

    return next({
      ctx,
    });
  });

  return {
    // Auth
    requestMagicLink: requestMagicLink(authClient),
    validateMagicLink: validateMagicLink(authClient),

    // Datalayers
    getPageData: getPageData(authClient),
    getLayerPoint: getLayerPoint(authClient),
    getLayerMarker: getLayerMarker(authClient),
  };
};

export { ServerError, createUserAuthClient, createPublicClient };
export type { AuthContext };
