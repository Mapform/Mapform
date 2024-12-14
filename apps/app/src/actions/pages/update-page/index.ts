"use server";

import { authClient } from "~/lib/safe-action";

export const updatePageAction = authClient.updatePage;
