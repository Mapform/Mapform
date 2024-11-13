"use server";

import { requestMagicLink } from "@mapform/backend/auth/request-magic-link/";
import { requestMagicLinkSchema } from "@mapform/backend/auth/request-magic-link/schema";
import { actionClient } from "~/lib/safe-action";

export const requestMagicLinkAction = actionClient
  .schema(requestMagicLinkSchema)
  .action(async ({ parsedInput }) => requestMagicLink(parsedInput));
