"server-only";

import { db } from "@mapform/db";
import { pages } from "@mapform/db/schema";
import { createPageSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";
import { getProjectWithPages } from "../../projects/get-project-with-pages";

export const createPage = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddlewareValidator)
    .schema(createPageSchema)
    .action(
      async ({ parsedInput: { projectId, center, zoom, pitch, bearing } }) => {
        const projectWithPagesResponse = await getProjectWithPages(authClient)({
          id: projectId,
        });

        if (!projectWithPagesResponse?.data) {
          throw new Error("Project not found");
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
          })
          .returning();

        return page;
      },
    );
