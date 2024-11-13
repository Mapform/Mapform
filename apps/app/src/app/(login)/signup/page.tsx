import Link from "next/link";
import Image from "next/image";
import mapform from "public/static/images/mapform.svg";
import { SignInForm } from "../form";

export default function SignupPage() {
  return (
    <>
      <Image alt="Logo" className="inline h-10 w-10" src={mapform} />
      <div>
        <h1 className="mb-2 text-2xl font-semibold text-stone-900">
          Get Started with Mapform
        </h1>
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link className="link" href="/signin">
            Sign in
          </Link>
        </p>
      </div>
      <SignInForm />
    </>
  );
}
