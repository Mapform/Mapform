"server-only";

import { db } from "@mapform/db";
import { eq, desc } from "@mapform/db/utils";
import { projects, pages } from "@mapform/db/schema";
import { shareClient } from "~/lib/safe-action";
import { getProjectWithPagesSchema } from "./schema";

/**
 * Retrieves the most recent child project from the root project ID
 */
export const getProjectWithPages = shareClient
  .schema(getProjectWithPagesSchema)
  .action(async ({ parsedInput: { id } }) => {
    // TODO: This line is causing the server error 'Action error: invalid input syntax for type uuid: "favicon.ico"'
    // No idea why really...but it is innocuous so leaving for now
    const [_projects] = await db
      .select()
      .from(projects)
      .where(eq(projects.rootProjectId, id))
      .orderBy(desc(projects.createdAt))
      .limit(1);

    if (!_projects) {
      throw new Error("Project not found");
    }

    const _pages = await db.query.pages.findMany({
      where: eq(pages.projectId, _projects.id),

      orderBy: (_pages2, { asc }) => [asc(_pages2.position)],
    });

    return {
      ..._projects,
      pages: _pages,
    };
  });

export type ProjectWithPages = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getProjectWithPages>>>["data"]
>;