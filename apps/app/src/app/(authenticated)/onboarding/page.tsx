import { OnboardingForm } from "./form";

export default function OnboardingPage() {
  return (
    <div className="flex w-full h-full items-center">
      <div className="mx-auto max-w-screen-sm px-4 text-center pb-20">
        <h1 className="text-xl font-semibold text-stone-900">
          Welcome to Mapform 📍
        </h1>
        <p className="text-stone-600 mt-2 mb-8">
          Before we get started, please confirm a few details.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}
