"server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { publicClient } from "~/lib/safe-action";

export const getCurrentSession = cache(async () => {
  const sessionCookie = (await cookies()).get("session")?.value ?? null;

  return publicClient.getCurrentSession({ token: sessionCookie });
});

export type GetCurrentSession = ReturnType<typeof getCurrentSession>;
