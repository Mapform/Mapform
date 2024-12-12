import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { datasets } from "@mapform/db/schema";
import type { DeleteDatasetSchema } from "./schema";

export const deleteDataset = async ({ datasetId }: DeleteDatasetSchema) =>
  db.delete(datasets).where(eq(datasets.id, datasetId));
