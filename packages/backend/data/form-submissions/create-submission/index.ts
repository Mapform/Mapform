"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { formSubmissions, projects, rows } from "@mapform/db/schema";
import { createSubmissionSchema } from "./schema";
import type { PublicClient } from "../../../lib/types";
import { ServerError } from "../../../lib/server-error";
import { getRowAndPageCount } from "../../usage/get-row-and-page-count";

export const createSubmission = (authClient: PublicClient) =>
  authClient
    .schema(createSubmissionSchema)
    .action(async ({ parsedInput: { projectId } }) => {
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
        with: {
          submissionsDataset: true,
          teamspace: {
            with: {
              workspace: {
                with: {
                  plan: true,
                },
              },
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      if (!project.submissionsDataset) {
        throw new Error("Submissions dataset not found");
      }

      const response = await getRowAndPageCount(authClient)({
        workspaceSlug: project.teamspace.workspaceSlug,
      });
      const rowCount = response?.data?.rowCount;
      const pageCount = response?.data?.pageCount;

      if (rowCount === undefined || pageCount === undefined) {
        throw new Error("Row count or page count is undefined.");
      }

      if (rowCount + pageCount >= project.teamspace.workspace.plan!.rowLimit) {
        throw new ServerError({
          message:
            "Row limit exceeded. Delete some rows, or upgrade your plan.",
        });
      }

      const [row] = await db
        .insert(rows)
        .values({
          datasetId: project.submissionsDataset.id,
        })
        .returning();

      if (!row) {
        throw new Error("There was an error creating the row.");
      }

      const [formSubmission] = await db
        .insert(formSubmissions)
        .values({
          rowId: row.id,
          projectId: project.id,
        })
        .returning();

      return formSubmission;
    });
