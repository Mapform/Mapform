"server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { publicDataService } from "~/lib/safe-action";

export const getCurrentSession = cache(async () => {
  const sessionCookie = (await cookies()).get("session")?.value ?? null;

  return publicDataService.getCurrentSession({ token: sessionCookie });
});

export type GetCurrentSession = ReturnType<typeof getCurrentSession>;
