"use server";

import { authDataService } from "~/lib/safe-action";

export const updateColumnOrderAction = authDataService.updateColumnOrder;
