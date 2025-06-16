"use server";

import { authClient } from "~/lib/safe-action";

export const createViewAction = authClient.createView;
