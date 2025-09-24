"server-only";

import type { UserAuthClient } from "../../../lib/types";
import { updateImageSchema } from "./schema";
import { blobs, projects, rows } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";

export const updateImage = (authClient: UserAuthClient) =>
  authClient
    .schema(updateImageSchema)
    .action(
      async ({
        parsedInput: { url, queuedForDeletionDate },
        ctx: { userAccess, db },
      }) => {
        const blob = await db.query.blobs.findFirst({
          where: eq(blobs.url, url),
        });

        if (!blob) {
          throw new Error("Blob not found");
        }

        if (!userAccess.workspace.checkAccessById(blob.workspaceId)) {
          throw new Error("Unauthorized");
        }

        if (blob.projectId) {
          const project = await db.query.projects.findFirst({
            where: eq(projects.id, blob.projectId),
          });

          if (!project) {
            throw new Error("Project not found");
          }

          if (!userAccess.teamspace.checkAccessById(project.teamspaceId)) {
            throw new Error("Unauthorized");
          }
        }

        if (blob.rowId) {
          const row = await db.query.rows.findFirst({
            where: eq(rows.id, blob.rowId),
            with: {
              project: {
                with: {
                  teamspace: true,
                },
              },
            },
          });

          if (!row) {
            throw new Error("Row not found");
          }

          if (!userAccess.teamspace.checkAccessById(row.project.teamspaceId)) {
            throw new Error("Unauthorized");
          }
        }

        return db
          .update(blobs)
          .set({
            queuedForDeletionDate,
          })
          .where(eq(blobs.url, url));
      },
    );
