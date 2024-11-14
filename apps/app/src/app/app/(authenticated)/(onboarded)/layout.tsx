import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentSession = await getCurrentSession();

  if (!currentSession?.user) {
    return null;
  }

  const firstWorkspace = currentSession.user.workspaceMemberships[0]?.workspace;

  /**
   * If the user doesn't have any workspaces, redirect them to the onboarding
   */
  if (!firstWorkspace) {
    return redirect("/onboarding");
  }

  return <>{children}</>;
}
