"server-only";

import { db } from "@mapform/db";
import { eq, and, sql } from "@mapform/db/utils";
import { pointCells, projects, formSubmissions } from "@mapform/db/schema";
import type { PublicClient, UnwrapReturn } from "../../../lib/types";
import { getSubmissionSchema } from "./schema";

export const getSubmission = (authClient: PublicClient) =>
  authClient
    .schema(getSubmissionSchema)
    .action(async ({ parsedInput: { submissionId, projectId } }) => {
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });

      if (!project) {
        throw new Error("Project not found.");
      }

      if (!project.datasetId) {
        throw new Error("Project has no submissions dataset.");
      }

      if (project.visibility === "closed") {
        throw new Error("Project is closed, the session cannot be accessed.");
      }

      const submission = await db.query.formSubmissions.findFirst({
        where: and(
          eq(formSubmissions.id, submissionId),
          eq(formSubmissions.projectId, projectId),
        ),
        with: {
          row: {
            with: {
              dataset: {
                columns: {
                  id: true,
                },
              },
              cells: {
                with: {
                  column: true,
                  booleanCell: true,
                  // pointCell: true,
                  pointCell: {
                    columns: {
                      id: true,
                    },
                    // TODO: Can remove this workaround once this is fixed: https://github.com/drizzle-team/drizzle-orm/pull/2778#issuecomment-2408519850
                    extras: {
                      x: sql<number>`ST_X(${pointCells.value})`.as("x"),
                      y: sql<number>`ST_Y(${pointCells.value})`.as("y"),
                    },
                  },
                  stringCell: true,
                  numberCell: true,
                  dateCell: true,
                },
              },
            },
          },
        },
      });
      console.log(33333, submission);

      if (submission?.row.datasetId !== project.datasetId) {
        throw new Error("The project and submission datasets do not match.");
      }

      return submission;
    });

export type GetSubmission = UnwrapReturn<typeof getSubmission>;
