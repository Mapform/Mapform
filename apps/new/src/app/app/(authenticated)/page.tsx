import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";

export default async function RootLayout() {
  const response = await getCurrentSession();

  if (!response?.data?.user) {
    redirect("/app/signin");
  }

  const firstWorkspaceSlug =
    response.data.user.workspaceMemberships[0]?.workspace.slug;

  if (!firstWorkspaceSlug) {
    redirect("/app/onboarding");
  }

  return redirect(`/app/${firstWorkspaceSlug}`);
}
