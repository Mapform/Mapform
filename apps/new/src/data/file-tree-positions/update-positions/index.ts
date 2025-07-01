"use server";

import { authClient } from "~/lib/safe-action";

export const updateFileTreePositionsAction = authClient.updateFileTreePositions;
