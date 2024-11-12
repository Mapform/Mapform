"use server";

import { signOut } from "@mapform/backend/auth/sign-out";
import { redirect } from "next/navigation";
import { actionClient } from "~/lib/safe-action";

export const signOutAction = actionClient.action(async () => {
  await signOut();

  redirect("/signin");
});
