"server-only";

import { getDataset } from "@mapform/backend/datasets/get-dataset";
import { getDatasetSchema } from "@mapform/backend/datasets/get-dataset/schema";
import { authAction } from "~/lib/safe-action";

export const getDatasetAction = authAction
  .schema(getDatasetSchema)
  .action(async ({ parsedInput }) => getDataset(parsedInput));
