"server-only";

import { db } from "@mapform/db";
import { eq, and, isNull } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getProjectWithPagesSchema } from "./schema";

export const getProjectWithPages = authAction
  .schema(getProjectWithPagesSchema)
  .action(({ parsedInput: { id } }) => {
    return db.query.projects.findFirst({
      where: and(eq(projects.id, id), isNull(projects.rootProjectId)),
      with: {
        pages: true,
      },
    });
  });

export type ProjectWithPages = NonNullable<
  Awaited<ReturnType<typeof getProjectWithPages>>
>["data"];
