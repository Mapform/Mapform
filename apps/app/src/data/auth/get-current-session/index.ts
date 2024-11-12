"server-only";

// eslint-disable-next-line import/named -- It will work when React 19 is released
import { cache } from "react";
import { cookies } from "next/headers";
import { getUser } from "@mapform/backend/users/get-user";
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

  const user = await getUser({ id: sessionData.user.id });

  if (!user) {
    return null;
  }

  return { user, session: sessionData };
});

export type GetCurrentSession = ReturnType<typeof getCurrentSession>;
