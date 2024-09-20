"server-only";

import { db } from "@mapform/db";
import { eq, and, isNull } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getProjectWithTeamspaceSchema } from "./schema";

export const getProjectWithTeamspace = authAction
  .schema(getProjectWithTeamspaceSchema)
  .action(({ parsedInput: { id } }) => {
    return db.query.projects.findFirst({
      where: and(eq(projects.id, id), isNull(projects.rootProjectId)),
      with: {
        teamspace: {
          columns: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
          },
        },
      },
    });
  });

export type ProjectWithTeamspace = NonNullable<
  Awaited<ReturnType<typeof getProjectWithTeamspace>>
>["data"];
