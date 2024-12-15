"use server";

import { publicClient } from "~/lib/safe-action";

export const submitPageAction = publicClient.submitPage;
