import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import type { DeleteProjectSchema } from "./schema";

export const deleteProject = async ({ projectId }: DeleteProjectSchema) =>
  db.delete(projects).where(eq(projects.id, projectId));
