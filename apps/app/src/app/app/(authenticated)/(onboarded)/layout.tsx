import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";
import { WelcomeTour } from "./welcome-tour";
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentSession = await getCurrentSession();

  if (!currentSession?.data?.user) {
    return null;
  }

  const firstWorkspace =
    currentSession.data.user.workspaceMemberships[0]?.workspace;

  /**
   * If the user doesn't have any workspaces, redirect them to the onboarding
   */
  if (!firstWorkspace) {
    return redirect("/app/onboarding");
  }

  return (
    <>
      {children}
      <WelcomeTour />
    </>
  );
}
