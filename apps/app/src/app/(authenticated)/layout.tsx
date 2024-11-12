import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await getCurrentSession();

  if (!response?.user) {
    redirect("/signin");
  }

  if (!response.user.hasOnboarded) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
