"use server";

import { authClient } from "~/lib/safe-action";

export const upsertCellAction = authClient.upsertCell;
