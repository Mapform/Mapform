import { db } from "@mapform/db";
import { datasets, pages, projects } from "@mapform/db/schema";
import type { CreateProjectSchema } from "./schema";

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 0,
  bearing: 0,
  pitch: 0,
};

export const createProject = async ({
  name,
  teamspaceId,
}: CreateProjectSchema) => {
  return db.transaction(async (tx) => {
    /**
     * Create submissions dataset
     */
    const [dataset] = await tx
      .insert(datasets)
      .values({
        name: `Responses for ${name}`,
        teamspaceId,
        type: "submissions",
      })
      .returning();

    if (!dataset) {
      throw new Error("Failed to create dataset");
    }

    /**
     * Create project
     */
    const [project] = await tx
      .insert(projects)
      .values({
        name,
        teamspaceId,
        datasetId: dataset.id,
      })
      .returning();

    if (!project) {
      throw new Error("Failed to create project");
    }

    /**
     * Create default page
     */
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
};
