import { db } from "@mapform/db";
import { datasets } from "@mapform/db/schema";
import type { UpdateDatasetSchema } from "./schema";
import { eq } from "@mapform/db/utils";

export const updateDataset = async ({ id, ...rest }: UpdateDatasetSchema) => {
  return db.update(datasets).set(rest).where(eq(datasets.id, id)).returning();
};
