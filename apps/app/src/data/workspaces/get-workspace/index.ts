"server-only";

import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { authAction } from "~/lib/safe-action";
import { getWorkspaceSchema } from "./schema";

export const getWorkspace = authAction
  .schema(getWorkspaceSchema)
  .action(async ({ parsedInput: { slug } }) => {
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.slug, slug),
    });

    return workspace;
  });

export type UserWorkspace = Awaited<ReturnType<typeof getWorkspace>>;
