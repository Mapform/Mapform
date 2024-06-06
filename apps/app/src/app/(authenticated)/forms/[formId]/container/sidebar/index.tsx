import { useContainerContext } from "../context";
import { LocationForm } from "./location-form";
import { DeleteButton } from "./delete-button";

export function Sidebar() {
  const { currentStep, setViewState, viewState } = useContainerContext();

  if (!currentStep) {
    return <div className="bg-white w-[400px] border-l" />;
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-white w-[400px] border-l">
      <h2 className="text-base font-semibold leading-6 text-gray-900 p-4 mb-0">
        {currentStep.title ?? "Untitled"}
      </h2>
      <section className="border-t border-b p-4">
        <h3 className="text-xs font-semibold leading-6 text-gray-400 mb-2">
          Location
        </h3>
        <LocationForm
          setViewState={setViewState}
          stepId={currentStep.id}
          viewState={viewState}
        />
      </section>
      <section className="mt-auto p-4 border-t">
        <h3 className="text-xs font-semibold leading-6 text-gray-400 mb-2">
          Danger Zone
        </h3>
        <DeleteButton stepId={currentStep.id} />
      </section>
    </div>
  );
}
