import Link from "next/link";
import { SignInForm } from "./form";

export default function SigninPage() {
  return (
    <div className="flex h-full w-full items-center">
      <div className="max-w-screen mx-auto flex w-[340px] max-w-screen-sm flex-col gap-8 px-4 pb-20">
        <SignInForm />
        <p className="text-muted-foreground text-sm">
          Need help?{" "}
          <Link className="link" href="mailto:hello@nichaley.com">
            Reach out
          </Link>
        </p>
      </div>
    </div>
  );
}
