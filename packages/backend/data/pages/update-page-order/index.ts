import { db } from "@mapform/db";
import { pages, projects } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { updatePageOrderSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const updatePageOrder = (authClient: UserAuthClient) =>
  authClient
    .schema(updatePageOrderSchema)
    .action(async ({ parsedInput: { projectId, pageOrder } }) => {
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });

      if (!project) {
        throw new Error("Project not found");
      }

      await db.transaction(async (tx) =>
        Promise.all(
          pageOrder.map((pageId, index) =>
            tx
              .update(pages)
              .set({
                position: index + 1,
              })
              .where(eq(pages.id, pageId)),
          ),
        ),
      );
    });
