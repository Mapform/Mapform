import Link from "next/link";
import Image from "next/image";
import { TimerIcon } from "lucide-react";
import { Alert, AlertDescription } from "@mapform/ui/components/alert";
import mapform from "public/static/images/mapform.svg";
import { SignInForm } from "../form";

export default async function SigninPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error: "not-found" | "expired" | "unknown" | null;
  }>;
}) {
  const error = (await searchParams)?.error;

  return (
    <>
      <Alert>
        <TimerIcon className="mr-2 inline h-[20px] w-[20px]" />
        <AlertDescription>
          {error === "not-found"
            ? "Email not found. Please sign up."
            : error === "expired"
              ? "Magic link expired. Please request a new one."
              : error === "unknown"
                ? "An unknown error occurred. Please try again."
                : null}
        </AlertDescription>
      </Alert>
      <Image alt="Logo" className="inline h-10 w-10" src={mapform} />
      <div>
        <h1 className="mb-2 text-2xl font-semibold text-stone-900">
          Sign in to Mapform
        </h1>
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link className="link" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
      <SignInForm />
    </>
  );
}
