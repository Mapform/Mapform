"server-only";

import { db } from "@mapform/db";
import { eq, and, inArray } from "@mapform/db/utils";
import { columns, datasets } from "@mapform/db/schema";
import { deleteColumnSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const deleteColumn = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(deleteColumnSchema)
    .action(async ({ parsedInput: { id }, ctx: { userAccess } }) => {
      // TODO: Not sure if this works lol
      const inTeamspace = db
        .$with("in_teamspace")
        .as(
          db
            .select()
            .from(columns)
            .leftJoin(datasets, eq(datasets.id, columns.datasetId))
            .where(inArray(datasets.teamspaceId, userAccess.teamspace.ids)),
        );

      return db.delete(columns).where(and(eq(columns.id, id), inTeamspace));
    });
