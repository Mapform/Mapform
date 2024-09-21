"server-only";

import { db } from "@mapform/db";
import { eq, and, isNull } from "@mapform/db/utils";
import { projects, pages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getProjectWithPagesSchema } from "./schema";

export const getProjectWithPages = authAction
  .schema(getProjectWithPagesSchema)
  .action(async ({ parsedInput: { id } }) => {
    // TODO: Cannot use 'with' with geometry columns currently due to Drizzle bug: https://github.com/drizzle-team/drizzle-orm/issues/2526
    // Once fix is merged we can simplify this
    const [_projects2, _pages] = await Promise.all([
      db.query.projects.findFirst({
        where: and(eq(projects.id, id), isNull(projects.rootProjectId)),
      }),

      db.query.pages.findMany({
        where: eq(pages.projectId, id),
      }),
    ]);

    if (!_projects2) {
      return null;
    }

    return {
      ..._projects2,
      pages: _pages,
    };
  });

export type ProjectWithPages = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getProjectWithPages>>>["data"]
>;
