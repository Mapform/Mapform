"use server";

import { authDataService } from "~/lib/safe-action";

export const createRowsAction = authDataService.createRows;
