"use server";

import { db } from "@mapform/db";
import { pages, projects } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { INITIAL_VIEW_STATE } from "~/constants/view-state";
import { createProjectSchema } from "./schema";

export const createProject = authAction
  .schema(createProjectSchema)
  .action(async ({ parsedInput: { name, teamspaceId } }) => {
    await db.transaction(async (tx) => {
      const [project] = await tx
        .insert(projects)
        .values({
          name,
          teamspaceId,
        })
        .returning();

      if (!project) {
        throw new Error("Failed to create project");
      }

      await tx.insert(pages).values({
        position: 1,
        projectId: project.id,
        zoom: INITIAL_VIEW_STATE.zoom,
        pitch: INITIAL_VIEW_STATE.pitch,
        bearing: INITIAL_VIEW_STATE.bearing,
        center: {
          x: INITIAL_VIEW_STATE.longitude,
          y: INITIAL_VIEW_STATE.latitude,
        },
      });

      return project;
    });
  });
