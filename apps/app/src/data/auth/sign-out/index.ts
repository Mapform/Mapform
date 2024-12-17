"use server";

import { authClient } from "~/lib/safe-action";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  await authClient.signOut({});

  redirect("/app/signin");
};
