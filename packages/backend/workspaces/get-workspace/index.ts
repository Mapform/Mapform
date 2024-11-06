import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import type { GetWorkspaceSchema } from "./schema";

export const getWorkspace = ({ slug }: GetWorkspaceSchema) =>
  db.query.workspaces.findFirst({
    where: eq(workspaces.slug, slug),
  });

export type UserWorkspace = NonNullable<
  Awaited<ReturnType<typeof getWorkspace>>
>;
