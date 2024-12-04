import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import type { UpdateWorkspaceSchema } from "./schema";
import { eq } from "@mapform/db/utils";

export const updateWorkspace = async ({
  id,
  ...rest
}: UpdateWorkspaceSchema) => {
  return db
    .update(workspaces)
    .set(rest)
    .where(eq(workspaces.id, id))
    .returning();
};
