"use server";

import { db } from "@mapform/db";
import { cookies } from "next/headers";
import { projects, rows } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { action } from "~/lib/safe-action";
import { createSubmissionSchema } from "./schema";

export const createSubmission = action
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

    const [row] = await db
      .insert(rows)
      .values({
        datasetId: project.submissionsDataset.id,
      })
      .returning();

    if (!row) {
      throw new Error("Failed to create submission");
    }

    cookies().set("mapform-submission", row.id);
    cookies().set("mapform-project-id", projectId);

    return row.id;
  });
