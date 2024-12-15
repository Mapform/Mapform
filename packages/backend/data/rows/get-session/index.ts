"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { rows } from "@mapform/db/schema";
import type { AuthClient } from "../../../lib/types";
import { publicMiddleware } from "../../../lib/middleware";
import { getSessionSchema } from "./schema";

export const getSession = (authClient: AuthClient) =>
  authClient
    .use(publicMiddleware)
    .schema(getSessionSchema)
    .action(async ({ parsedInput: { rowId } }) => {
      // TODO: Need authorizations checks here.
      // Need to make sure that the rows dataset has been made public.
      return db.query.rows.findFirst({
        where: eq(rows.id, rowId),
      });
    });
