"use server";

import { publicClient } from "~/lib/safe-action";

export const requestMagicLinkAction = publicClient.requestMagicLink;
