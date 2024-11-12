import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";

export default async function RootLayout() {
  const response = await getCurrentSession();

  if (!response?.user) {
    redirect("/signin");
  }

  const firstWorkspaceSlug =
    response.user.workspaceMemberships[0]?.workspace.slug;

  if (!firstWorkspaceSlug) {
    redirect("/create-workspace");
  }

  return redirect(firstWorkspaceSlug);
}
