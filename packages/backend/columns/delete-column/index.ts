import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { columns } from "@mapform/db/schema";
import { type DeleteColumnSchema } from "./schema";

export const deleteColumn = async ({ id }: DeleteColumnSchema) =>
  db.delete(columns).where(eq(columns.id, id));
