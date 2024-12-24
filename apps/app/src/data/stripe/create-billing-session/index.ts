"use server";

import { authClient } from "~/lib/safe-action";

export const createBillingSessionAction = authClient.createBillingSession;
