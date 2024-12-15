"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { projects, rows } from "@mapform/db/schema";
import { createSubmissionSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { publicMiddleware } from "../../../lib/middleware";

export const createSubmission = (authClient: AuthClient) =>
  authClient
    .use(publicMiddleware)
    .schema(createSubmissionSchema)
    .action(async ({ parsedInput: { projectId } }) => {
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
        with: {
          submissionsDataset: true,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      if (!project.submissionsDataset) {
        throw new Error("Submissions dataset not found");
      }

      const [row] = await db
        .insert(rows)
        .values({
          datasetId: project.submissionsDataset.id,
        })
        .returning();

      return row;
    });
