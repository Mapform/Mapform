import { db } from "@mapform/db";
import { projects } from "@mapform/db/schema";
import type { UpdateProjectSchema } from "./schema";
import { eq } from "@mapform/db/utils";

export const updateProject = async ({ id, ...rest }: UpdateProjectSchema) => {
  return db.update(projects).set(rest).where(eq(projects.id, id)).returning();
};
