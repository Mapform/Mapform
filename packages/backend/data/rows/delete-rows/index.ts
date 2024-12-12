import { db } from "@mapform/db";
import { inArray } from "@mapform/db/utils";
import { rows } from "@mapform/db/schema";
import type { DeleteRowsSchema } from "./schema";

export const deleteRows = async ({ rowIds }: DeleteRowsSchema) =>
  db.delete(rows).where(inArray(rows.id, rowIds));
