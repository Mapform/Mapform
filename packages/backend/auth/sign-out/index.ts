import { type SignOutSchema } from "./schema";
import { deleteSessionTokenCookie } from "@mapform/auth/helpers/cookies";
import { invalidateSession } from "@mapform/auth/helpers/sessions";

export const signOut = async ({ token }: SignOutSchema) => {
  await deleteSessionTokenCookie();
  await invalidateSession(token);
};
