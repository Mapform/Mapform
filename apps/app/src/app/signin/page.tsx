import { SignInForm } from "./form";

export default function SigninPage() {
  return (
    <div className="flex h-full w-full items-center">
      <div className="mx-auto max-w-screen-sm px-4 pb-20 text-center">
        <h1 className="text-xl font-semibold text-stone-900">
          Sign in to Mapform
        </h1>
        <SignInForm />
      </div>
    </div>
  );
}
