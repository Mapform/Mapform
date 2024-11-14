import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";
import { OnboardingForm } from "./form";

export default async function OnboardingPage() {
  const currentSession = await getCurrentSession();

  if (!currentSession?.user) {
    return redirect("/signin");
  }

  const firstWorkspace = currentSession.user.workspaceMemberships[0]?.workspace;

  if (firstWorkspace) {
    return redirect(`/${firstWorkspace.slug}`);
  }

  return (
    <div className="flex h-full w-full items-center">
      <div className="mx-auto max-w-screen-sm px-4 pb-20 text-center">
        <h1 className="text-xl font-semibold text-stone-900">
          Welcome to Mapform 📍
        </h1>
        <p className="mb-8 mt-2 text-stone-600">
          Before we get started, please confirm a few details.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}
