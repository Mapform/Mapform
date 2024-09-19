"server-only";

import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { authAction } from "~/lib/safe-action";
import { getWorkspaceSchema } from "./schema";

export const getWorkspace = authAction
  .schema(getWorkspaceSchema)
  .action(({ parsedInput: { slug } }) => {
    return db.query.workspaces.findFirst({
      where: eq(workspaces.slug, slug),
    });
  });

export type UserWorkspace = NonNullable<
  Awaited<ReturnType<typeof getWorkspace>>
>["data"];
