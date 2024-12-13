"use server";

import { authClient } from "~/lib/safe-action";

export const createEmptyDatasetAction = authClient.createEmptyDataset;
