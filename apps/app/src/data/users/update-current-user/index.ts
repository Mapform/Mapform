"use server";

import { authClient } from "~/lib/safe-action";

export const updateCurrentUserAction = authClient.updateCurrentUser;
