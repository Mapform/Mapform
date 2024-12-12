import { deleteSession } from "@mapform/auth/helpers/sessions";

export const signOut = async () => {
  await deleteSession();
};
