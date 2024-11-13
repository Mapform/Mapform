import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { CircleHelpIcon, TimerIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
} from "@mapform/ui/components/alert";
import mapform from "public/static/images/mapform.svg";
import type { MagicLinkErrors } from "~/constants/magic-link-errors";
import { SignInForm } from "../form";

const errors: Record<MagicLinkErrors, { text: string; icon: LucideIcon }> = {
  "not-found": {
    text: "An unknown error occurred. Please try again.",
    icon: CircleHelpIcon,
  },
  expired: {
    text: "Magic link expired. Please request a new one.",
    icon: TimerIcon,
  },
  unknown: {
    text: "An unknown error occurred. Please try again.",
    icon: CircleHelpIcon,
  },
};

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
      {error ? (
        <Alert>
          <AlertIcon icon={errors[error].icon} />
          <AlertDescription>{errors[error].text}</AlertDescription>
        </Alert>
      ) : null}
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
