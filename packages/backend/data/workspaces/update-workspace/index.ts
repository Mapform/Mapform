import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import type { UpdateWorkspaceSchema } from "./schema";
import { eq } from "@mapform/db/utils";

export const updateWorkspace = async ({
  id,
  ...rest
}: UpdateWorkspaceSchema) => {
  return db.transaction(async (tx) => {
    const prevWorkspace = await tx.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
    });

    if (!prevWorkspace) {
      throw new Error("Workspace not found");
    }

    return tx
      .update(workspaces)
      .set(rest)
      .where(eq(workspaces.id, id))
      .returning();
  });
};
