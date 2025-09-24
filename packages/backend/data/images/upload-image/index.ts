"server-only";

import type { UserAuthClient } from "../../../lib/types";
import { uploadImageSchema } from "./schema";
import { put } from "@vercel/blob";
import { sql } from "@mapform/db";
import { blobs, projects, rows, workspaces } from "@mapform/db/schema";
import { eq, and, isNotNull, gt } from "@mapform/db/utils";
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
          author,
          license,
          licenseUrl,
          sourceUrl,
          description,
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

          // Safely shift existing image orders by +1 within the same scope
          // without violating unique constraints. Eventually, drizzle should
          // release support for 'deferrable', which will make this cleaner:
          // https://github.com/drizzle-team/drizzle-orm/issues/1429
          if (projectId || rowId) {
            // Phase 1: bump all existing orders by a large offset to avoid transient conflicts
            await tx
              .update(blobs)
              .set({ order: sql`${blobs.order} + 1000000` })
              .where(
                and(
                  projectId
                    ? eq(blobs.projectId, projectId)
                    : eq(blobs.rowId, rowId!),
                  isNotNull(blobs.order),
                ),
              );

            // Phase 2: normalize back to +1 net shift
            await tx
              .update(blobs)
              .set({ order: sql`${blobs.order} - 999999` })
              .where(
                and(
                  projectId
                    ? eq(blobs.projectId, projectId)
                    : eq(blobs.rowId, rowId!),
                  gt(blobs.order, 999999),
                ),
              );
          }

          const [blob] = await tx
            .insert(blobs)
            .values({
              size: image.size,
              url: putResponse.url,
              workspaceId,
              projectId,
              rowId,
              licenseUrl,
              sourceUrl,
              description,
              author,
              license,
              order: 0,
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
