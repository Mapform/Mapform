import { getCurrentSession } from "~/data/auth/get-current-session";
import { AuthProvider } from "./auth-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentSessionPromise = getCurrentSession();

  return (
    <AuthProvider currentSessionPromise={currentSessionPromise}>
      {children}
    </AuthProvider>
  );
}
