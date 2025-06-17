"use server";

import { authClient } from "~/lib/safe-action";

export const createManyRowsAction = authClient.createManyRows;
