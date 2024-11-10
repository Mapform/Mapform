import Link from "next/link";
import Image from "next/image";
import mapform from "public/mapform.svg";
import { SignInForm } from "./form";

export default function SigninPage() {
  return (
    <div className="flex h-full w-full items-center">
      <div className="max-w-screen mx-auto flex w-[340px] max-w-screen-sm flex-col gap-8 px-4 pb-20">
        <div className="">
          <Image alt="Logo" className="mb-4 inline h-10 w-10" src={mapform} />
          <h1 className="text-2xl font-semibold text-stone-900">
            Sign in to Mapform
          </h1>
        </div>
        <SignInForm />
        <p className="text-muted-foreground text-sm">
          Need help?{" "}
          <Link className="link" href="hello@nichaley.com">
            Reach out
          </Link>
        </p>
      </div>
    </div>
  );
}
