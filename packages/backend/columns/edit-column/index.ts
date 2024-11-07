import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { columns } from "@mapform/db/schema";
import { type EditColumnSchema } from "./schema";

export const editColumn = async ({ name, id }: EditColumnSchema) => {
  const [col] = await db
    .update(columns)
    .set({ name })
    .where(eq(columns.id, id))
    .returning();

  return col;
};
