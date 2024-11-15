"use server";

import { signOut } from "@mapform/backend/auth/sign-out";
import { redirect } from "next/navigation";
import { baseClient } from "~/lib/safe-action";

export const signOutAction = baseClient.action(async () => {
  await signOut();

  redirect("/app/signin");
});
