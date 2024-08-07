import { Button } from "@mapform/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@mapform/ui/components/drawer";
import { ArrowLeftIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@mapform/ui/components/accordion";
import { useContainerContext } from "../context";
import { DeleteButton } from "./delete-button";
import { GeneralForm } from "./general-form";

export const StepDrawerRoot = Drawer;
export const StepDrawerTrigger = DrawerTrigger;

export function StepDrawerContent() {
  const { currentStep, setViewState, viewState, currentDataTrack } =
    useContainerContext();

  if (!currentStep) {
    return <div className="bg-white w-[400px] border-l" />;
  }

  return (
    <DrawerContent>
      <DrawerHeader className="flex justify-between items-center py-2">
        <h2>Edit Step</h2>
        <div className="-mr-2">
          <DrawerTrigger asChild>
            <Button size="sm" variant="ghost">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
        </div>
      </DrawerHeader>

      <Accordion defaultValue={["item-1"]} type="multiple">
        <AccordionItem className="border-t border-b" value="item-1">
          <AccordionTrigger className="px-4">
            <h3 className="text-xs font-semibold leading-6 text-gray-400 mb-0">
              General
            </h3>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <GeneralForm currentStep={currentStep} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className="border-b" value="item-2">
          <AccordionTrigger className="px-4">
            <h3 className="text-xs font-semibold leading-6 text-gray-400 mb-0">
              Danger Zone
            </h3>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <DeleteButton stepId={currentStep.id} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DrawerContent>
  );
}
