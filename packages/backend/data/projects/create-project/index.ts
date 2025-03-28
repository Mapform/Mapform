"server-only";

import { db } from "@mapform/db";
import { datasets, pages, projects, teamspaces } from "@mapform/db/schema";
import { createProjectSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { ServerError } from "../../../lib/server-error";
import { getRowAndPageCount } from "../../usage/get-row-and-page-count";
import { eq } from "@mapform/db/utils";

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 0,
  bearing: 0,
  pitch: 0,
};

export const createProject = (authClient: UserAuthClient) =>
  authClient
    .schema(createProjectSchema)
    .action(
      async ({
        parsedInput: { teamspaceId, formsEnabled, ...rest },
        ctx: { userAccess },
      }) => {
        if (!userAccess.teamspace.checkAccessById(teamspaceId)) {
          throw new Error("Unauthorized");
        }

        const teamspace = await db.query.teamspaces.findFirst({
          where: eq(teamspaces.id, teamspaceId),
          with: {
            workspace: {
              with: {
                plan: true,
              },
            },
          },
        });

        if (!teamspace) {
          throw new Error("Teamspace not found");
        }

        if (formsEnabled && !teamspace.workspace.plan?.stripeSubscriptionId) {
          throw new ServerError("Upgrade your plan to enable forms.");
        }

        const rowAndPageCountResponse = await getRowAndPageCount(authClient)({
          workspaceSlug: teamspace.workspaceSlug,
        });

        if (!rowAndPageCountResponse?.data) {
          throw new Error("Row and page count not found");
        }

        const { rowCount, pageCount } = rowAndPageCountResponse.data;

        if (rowCount === undefined || pageCount === undefined) {
          throw new Error("Row and page count not found");
        }

        if (rowCount + pageCount >= teamspace.workspace.plan!.rowLimit) {
          throw new ServerError(
            "Row limit exceeded. Delete some rows, or upgrade your plan.",
          );
        }

        return db.transaction(async (tx) => {
          let datasetId: string | undefined;
          /**
           * Create submissions dataset
           */
          if (formsEnabled) {
            const [dataset] = await tx
              .insert(datasets)
              .values({
                name: `Responses for ${rest.name}`,
                teamspaceId,
                type: "submissions",
              })
              .returning();

            if (!dataset) {
              throw new Error("Failed to create dataset");
            }

            datasetId = dataset.id;
          }

          /**
           * Create project
           */
          const [project] = await tx
            .insert(projects)
            .values({
              ...rest,
              teamspaceId,
              formsEnabled,
              datasetId,
            })
            .returning();

          if (!project) {
            throw new Error("Failed to create project");
          }

          /**
           * Create default page
           */
          await Promise.all([
            tx.insert(pages).values({
              position: 1,
              projectId: project.id,
              zoom: INITIAL_VIEW_STATE.zoom,
              pitch: INITIAL_VIEW_STATE.pitch,
              bearing: INITIAL_VIEW_STATE.bearing,
              center: {
                x: INITIAL_VIEW_STATE.longitude,
                y: INITIAL_VIEW_STATE.latitude,
              },
            }),

            formsEnabled &&
              tx.insert(pages).values({
                position: 2,
                projectId: project.id,
                zoom: INITIAL_VIEW_STATE.zoom,
                pitch: INITIAL_VIEW_STATE.pitch,
                bearing: INITIAL_VIEW_STATE.bearing,
                center: {
                  x: INITIAL_VIEW_STATE.longitude,
                  y: INITIAL_VIEW_STATE.latitude,
                },
                pageType: "page_ending",
              }),
          ]);

          return project;
        });
      },
    );
