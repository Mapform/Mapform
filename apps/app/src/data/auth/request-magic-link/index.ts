"use server";

import { requestMagicLink } from "@mapform/backend/auth/request-magic-link/";
import { requestMagicLinkSchema } from "@mapform/backend/auth/request-magic-link/schema";
import { baseClient } from "~/lib/safe-action";

export const requestMagicLinkAction = baseClient
  .schema(requestMagicLinkSchema)
  .action(async ({ parsedInput }) => requestMagicLink(parsedInput));
