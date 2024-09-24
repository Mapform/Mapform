"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { listAvailableDatasetsSchema } from "./schema";

export const listAvailableDatasets = authAction
  .schema(listAvailableDatasetsSchema)
  .action(async ({ parsedInput: { projectId } }) => {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return db.query.datasets.findMany({
      where: eq(projects.teamspaceId, project.teamspaceId),
      with: {
        columns: true,
      },
    });
  });

export type ListAvailableDatasets = NonNullable<
  NonNullable<Awaited<ReturnType<typeof listAvailableDatasets>>>["data"]
>;
