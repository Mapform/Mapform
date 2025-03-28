"server-only";

import { db } from "@mapform/db";
import { pages } from "@mapform/db/schema";
import { createPageSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { getProjectWithPages } from "../../projects/get-project-with-pages";
import { getRowAndPageCount } from "../../usage/get-row-and-page-count";
import { ServerError } from "../../../lib/server-error";

export const createPage = (authClient: UserAuthClient) =>
  authClient
    .schema(createPageSchema)
    .action(
      async ({
        parsedInput: { projectId, center, zoom, pitch, bearing, pageType },
      }) => {
        const projectWithPagesResponse = await getProjectWithPages(authClient)({
          id: projectId,
        });

        if (!projectWithPagesResponse?.data) {
          throw new Error("Project not found");
        }

        const rowAndPageCountResponse = await getRowAndPageCount(authClient)({
          workspaceSlug: projectWithPagesResponse.data.teamspace.workspace.slug,
        });

        if (!rowAndPageCountResponse?.data) {
          throw new Error("Row and page count not found");
        }

        const { rowCount, pageCount } = rowAndPageCountResponse.data;

        if (rowCount === undefined || pageCount === undefined) {
          throw new Error("Row and page count not found");
        }

        if (
          rowCount + pageCount >=
          projectWithPagesResponse.data.teamspace.workspace.plan!.rowLimit
        ) {
          throw new ServerError(
            "Row limit exceeded. Delete some rows, or upgrade your plan.",
          );
        }

        const nextPagePosition = projectWithPagesResponse.data.pages.length + 1;

        const [page] = await db
          .insert(pages)
          .values({
            projectId,
            position: nextPagePosition,
            zoom,
            pitch,
            bearing,
            center,
            pageType,
          })
          .returning();

        return page;
      },
    );
