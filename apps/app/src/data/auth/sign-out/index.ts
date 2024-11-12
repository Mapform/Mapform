"use server";

import { signOut } from "@mapform/backend/auth/sign-out";
import { redirect } from "next/navigation";
import { authAction } from "~/lib/safe-action";

export const signOutAction = authAction.action(async () => {
  await signOut();

  redirect("/signin");
});
