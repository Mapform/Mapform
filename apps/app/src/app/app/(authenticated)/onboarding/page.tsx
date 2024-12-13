import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentSession } from "~/actions/auth/get-current-session";
import mapform from "public/static/images/mapform.svg";
import { OnboardingForm } from "./form";

export default async function OnboardingPage() {
  const currentSession = await getCurrentSession();

  if (!currentSession?.user) {
    return redirect("/app/signin");
  }

  const firstWorkspace = currentSession.user.workspaceMemberships[0]?.workspace;

  if (firstWorkspace) {
    return redirect(`/app/${firstWorkspace.slug}`);
  }

  return (
    <div className="flex h-full w-full items-center">
      <div className="max-w-screen mx-auto flex w-[400px] max-w-screen-sm flex-col gap-8 px-4 pb-20">
        <Image alt="Logo" className="inline h-10 w-10" src={mapform} />
        <div>
          <h1 className="mb-2 text-2xl font-semibold text-stone-900">
            Welcome to Mapform!
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s get you started with your first workspace.
          </p>
        </div>
        <OnboardingForm email={currentSession.user.email} />
      </div>
    </div>
  );
}
