"use server";

import { authDataService } from "~/lib/safe-action";

export const createRowAction = authDataService.createRow;
