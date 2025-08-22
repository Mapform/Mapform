import { Suspense } from "react";
import { SignInForm } from "../form";

export default function SigninPage() {
  return (
    <Suspense>
      <SignInForm type="signin" />
    </Suspense>
  );
}
