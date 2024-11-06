import { db } from "@mapform/db";
import { columns } from "@mapform/db/schema";
import { type CreateColumnSchema } from "./schema";

export const createColumn = async ({
  name,
  datasetId,
  type,
}: CreateColumnSchema) => {
  const [newColumn] = await db
    .insert(columns)
    .values({
      name,
      datasetId,
      type,
    })
    .returning();

  return newColumn;
};
