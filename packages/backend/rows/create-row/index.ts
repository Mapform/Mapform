import { db } from "@mapform/db";
import { rows } from "@mapform/db/schema";
import type { CreateRowSchema } from "./schema";

export const createRow = async ({ datasetId }: CreateRowSchema) => {
  const [newRow] = await db
    .insert(rows)
    .values({
      datasetId,
    })
    .returning();

  return newRow;
};
