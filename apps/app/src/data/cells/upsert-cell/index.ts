"use server";

import { upsertCell } from "@mapform/backend/cells/upsert-cell";
import { upsertCellSchema } from "@mapform/backend/cells/upsert-cell/schema";
import { authAction } from "~/lib/safe-action";

export const upsertCellAction = authAction
  .schema(upsertCellSchema)
  .action(async ({ parsedInput }) => upsertCell(parsedInput));
