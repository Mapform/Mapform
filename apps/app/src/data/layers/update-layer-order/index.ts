"use server";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { revalidatePath } from "next/cache";
import { layersToPages, projects } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { updateLayerOrderSchema } from "./schema";

export const updateLayerOrder = authAction
  .schema(updateLayerOrderSchema)
  .action(async ({ parsedInput: { pageId, layerOrder } }) => {
    const page = await db.query.pages.findFirst({
      where: eq(projects.id, pageId),
      with: {
        project: {
          columns: {
            id: true,
          },
          with: {
            teamspace: {
              with: {
                workspace: {
                  columns: {
                    id: true,
                  },
                },
              },
              columns: {
                id: true,
              },
            },
          },
        },
        layersToPages: {
          columns: {
            position: true,
          },
          with: {
            layer: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!page) {
      throw new Error("Page not found");
    }

    await db.transaction(async (tx) =>
      Promise.all(
        layerOrder.map((layerId, index) =>
          tx
            .update(layersToPages)
            .set({
              position: index + 1,
            })
            .where(eq(layersToPages.layerId, layerId))
        )
      )
    );

    revalidatePath(
      `/${page.project.teamspace.workspace.id}/${page.project.teamspace.id}/projects/${page.projectId}`
    );
  });
