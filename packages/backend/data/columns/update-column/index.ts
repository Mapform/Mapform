"server-only";

import { eq } from "@mapform/db/utils";
import { columns } from "@mapform/db/schema";
import { updateColumnSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const updateColumn = (authClient: UserAuthClient) =>
  authClient
    .schema(updateColumnSchema)
    .action(async ({ parsedInput: { id, name }, ctx: { db } }) => {
      const column = await db.query.columns.findFirst({
        where: eq(columns.id, id),
      });

      if (!column) {
        throw new Error("Column not found");
      }

      const projectColumns = await db.query.columns.findMany({
        where: eq(columns.projectId, column.projectId),
      });

      let columnName = name;
      let i = 1;
      while (projectColumns.some((c) => c.name === columnName)) {
        columnName = `${name} ${i}`;
        i++;
      }

      const [col] = await db
        .update(columns)
        .set({ name: columnName })
        .where(eq(columns.id, id))
        .returning();

      return col;
    });
