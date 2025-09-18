"use server";

import { publicDataService } from "~/lib/safe-action";

export const requestMagicLinkAction = publicDataService.requestMagicLink;
