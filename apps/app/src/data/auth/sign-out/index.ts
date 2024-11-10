"use server";

import { signOut } from "@mapform/backend/auth/sign-out";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authAction } from "~/lib/safe-action";

export const signOutAction = authAction.action(async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("session")?.value ?? null;

  if (!authToken) {
    throw new Error("User not authenticated.");
  }

  await signOut({ token: authToken });

  redirect("/signin");
});
