"server-only";

import { db } from "@mapform/db";
import { rows } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";

/**
 * A session is just a row in the submissions database
 */
export function getSession(rowId: string) {
  return db.query.rows.findFirst({
    where: eq(rows.id, rowId),
  });
}
