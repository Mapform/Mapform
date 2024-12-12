"server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { authClient } from "~/lib/safe-action";
import { verifyToken } from "@mapform/auth/helpers/sessions";

export const getCurrentSession = cache(async () => {
  const sessionCookie = (await cookies()).get("session")?.value ?? null;

  if (!sessionCookie) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie);

  if (!sessionData.user || !sessionData.expires) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await authClient.getUser({ id: sessionData.user.id });

  if (!user) {
    return null;
  }

  return { user, session: sessionData };
});

export type GetCurrentSession = ReturnType<typeof getCurrentSession>;
