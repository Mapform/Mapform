"use server";

import { authDataService } from "~/lib/safe-action";

export const upsertCellAction = authDataService.upsertCell;
