"server-only";

import type { UserAuthClient } from "../../../lib/types";
import { uploadImageSchema } from "./schema";
import { put } from "@vercel/blob";
import { blobs, projects, rows, workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { ServerError } from "../../../lib/server-error";
import { getStorageUsage } from "../../usage/get-storage-usage";
import { env } from "../../../env.mjs";

export const uploadImage = (authClient: UserAuthClient) =>
  authClient
    .schema(uploadImageSchema)
    .action(
      async ({
        parsedInput: {
          image,
          workspaceId,
          projectId,
          rowId,
          title,
          author,
          license,
        },
        ctx: { userAccess, db },
      }) => {
        if (!userAccess.workspace.checkAccessById(workspaceId)) {
          throw new Error("Unauthorized");
        }

        // Get workspace slug for storage check
        const workspace = await db.query.workspaces.findFirst({
          where: eq(workspaces.id, workspaceId),
          with: {
            plan: true,
          },
        });

        let blobCount = 0;

        if (projectId) {
          const project = await db.query.projects.findFirst({
            where: eq(projects.id, projectId),
            with: {
              teamspace: {
                with: {
                  workspace: {
                    columns: {
                      id: true,
                    },
                  },
                },
              },
              blobs: true,
            },
          });

          if (!project) {
            throw new Error("Project not found");
          }

          if (project.teamspace.workspace.id !== workspaceId) {
            throw new Error("Project does not belong to this workspace");
          }

          blobCount = project.blobs.length + 1;
        }

        if (rowId) {
          const row = await db.query.rows.findFirst({
            where: eq(rows.id, rowId),
            with: {
              project: {
                with: {
                  teamspace: {
                    with: {
                      workspace: {
                        columns: {
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
              blobs: true,
            },
          });

          if (!row) {
            throw new Error("Row not found");
          }

          if (row.project.teamspace.workspace.id !== workspaceId) {
            throw new Error("Row does not belong to this workspace");
          }

          blobCount = row.blobs.length + 1;
        }

        if (!workspace || !workspace.plan) {
          throw new Error("Workspace or plan not found");
        }

        // Check current storage usage
        const storageResponse = await getStorageUsage(authClient)({
          workspaceSlug: workspace.slug,
        });

        const currentStorageBytes = storageResponse?.data?.totalStorageBytes;
        if (currentStorageBytes === undefined) {
          throw new Error("Could not determine current storage usage");
        }

        // Check if uploading this image would exceed the storage limit
        if (currentStorageBytes + image.size > workspace.plan.storageLimit) {
          throw new ServerError(
            "Storage limit exceeded. Delete some images or upgrade your plan.",
          );
        }

        const response = await db.transaction(async (tx) => {
          const envSegment = env.VERCEL_ENV ?? "development";
          const pathSegments = [
            envSegment,
            `workspaces/${workspaceId}`,
            ...(projectId ? [`projects/${projectId}`] : []),
            ...(rowId ? [`rows/${rowId}`] : []),
            image.name,
          ];

          const putResponse = await put(pathSegments.join("/"), image, {
            access: "public",
            addRandomSuffix: true,
          });

          const [blob] = await tx
            .insert(blobs)
            .values({
              size: image.size,
              url: putResponse.url,
              workspaceId,
              projectId,
              rowId,
              title,
              author,
              license,
              order: blobCount + 1,
            })
            .returning();

          if (!blob) {
            throw new Error("Failed to insert blob");
          }

          return putResponse;
        });

        return response;
      },
    );
