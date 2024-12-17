"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { rows } from "@mapform/db/schema";
import type { PublicClient } from "../../../lib/types";
import { getSessionSchema } from "./schema";

export const getSession = (authClient: PublicClient) =>
  authClient
    .schema(getSessionSchema)
    .action(async ({ parsedInput: { rowId } }) => {
      // TODO: Need authorizations checks here.
      // Need to make sure that the rows dataset has been made public.
      return db.query.rows.findFirst({
        where: eq(rows.id, rowId),
      });
    });
