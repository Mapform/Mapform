"server-only";

import { db } from "@mapform/db";
import { eq, desc } from "@mapform/db/utils";
import { projects, pages } from "@mapform/db/schema";
import { action } from "~/lib/safe-action";
import { getProjectWithPagesSchema } from "./schema";

/**
 * Retrieves the most recent child project from the root project ID
 */
export const getProjectWithPages = action
  .schema(getProjectWithPagesSchema)
  .action(async ({ parsedInput: { id } }) => {
    // TODO: Cannot use 'with' with geometry columns currently due to Drizzle bug: https://github.com/drizzle-team/drizzle-orm/issues/2526
    // Once fix is merged we can simplify this
    const [[_project], _pages] = await Promise.all([
      db
        .select()
        .from(projects)
        .where(eq(projects.rootProjectId, id))
        .orderBy(desc(projects.createdAt))
        .limit(1),

      db.query.pages.findMany({
        where: eq(pages.projectId, id),
        orderBy: (_pages2, { asc }) => [asc(_pages2.position)],
      }),
    ]);

    if (!_project) {
      throw new Error("Project not found");
    }

    return {
      ..._project,
      pages: _pages,
    };
  });

export type ProjectWithPages = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getProjectWithPages>>>["data"]
>;
