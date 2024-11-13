import { Suspense } from "react";
import { SignInForm } from "../form";

export default function SignupPage() {
  return (
    <Suspense>
      <SignInForm type="signup" />
    </Suspense>
  );
}
