import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@mapform/ui/components/accordion";
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
      <h2 className="text-base font-semibold leading-6 text-gray-900 p-4 mb-0 border-b">
        {currentStep.title || "Untitled"}
      </h2>
      <Accordion defaultValue={["item-1"]} type="multiple">
        <AccordionItem className="border-b px-4" value="item-1">
          <AccordionTrigger>
            <h3 className="text-xs font-semibold leading-6 text-gray-400 mb-0">
              Location
            </h3>
          </AccordionTrigger>
          <AccordionContent>
            <LocationForm
              setViewState={setViewState}
              stepId={currentStep.id}
              viewState={viewState}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className="border-b px-4" value="item-2">
          <AccordionTrigger>
            <h3 className="text-xs font-semibold leading-6 text-gray-400 mb-0">
              Danger Zone
            </h3>
          </AccordionTrigger>
          <AccordionContent>
            <DeleteButton stepId={currentStep.id} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
