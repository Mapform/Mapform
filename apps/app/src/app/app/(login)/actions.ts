"use server";

import { authClient } from "~/lib/safe-action";

export const requestMagicLinkAction = authClient.requestMagicLink;
