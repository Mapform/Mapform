import { redirect } from "next/navigation";
import { getCurrentSession } from "~/actions/auth/get-current-session";

export default async function RootLayout() {
  const response = await getCurrentSession();

  if (!response?.user) {
    redirect("/app/signin");
  }

  const firstWorkspaceSlug =
    response.user.workspaceMemberships[0]?.workspace.slug;

  if (!firstWorkspaceSlug) {
    redirect("/app/onboarding");
  }

  return redirect(`/app/${firstWorkspaceSlug}`);
}
