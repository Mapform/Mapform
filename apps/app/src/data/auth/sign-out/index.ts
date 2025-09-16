"use server";

import { authDataService } from "~/lib/safe-action";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  await authDataService.signOut({});

  redirect("/app/signin");
};
