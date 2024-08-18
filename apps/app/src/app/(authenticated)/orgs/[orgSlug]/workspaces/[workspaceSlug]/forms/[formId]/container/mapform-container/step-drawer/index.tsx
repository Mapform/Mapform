import { Button, buttonVariants } from "@mapform/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@mapform/ui/components/drawer";
import { ChevronsLeftIcon, PlusIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@mapform/ui/components/accordion";
import { useContainerContext } from "../../context";
import { DeleteButton } from "./delete-button";
import { GeneralForm } from "./general-form";
import { cn } from "@mapform/lib/classnames";

export const StepDrawerRoot = Drawer;
export const StepDrawerTrigger = DrawerTrigger;

export function StepDrawerContent() {
  const { currentStep } = useContainerContext();

  if (!currentStep) {
    return <div className="bg-white w-[400px] border-l" />;
  }

  return (
    <DrawerContent>
      <DrawerHeader className="flex justify-between items-center py-2">
        <h2 className="text-base font-medium">Edit Step</h2>
        <div className="-mr-2">
          <DrawerTrigger asChild>
            <Button size="icon-sm" variant="ghost">
              <ChevronsLeftIcon className="size-4" />
            </Button>
          </DrawerTrigger>
        </div>
      </DrawerHeader>

      <Accordion defaultValue={["item-1"]} type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>General</AccordionTrigger>
          <AccordionContent>
            <GeneralForm currentStep={currentStep} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <span className="flex-1 text-left">Data layers</span>
            <span
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-xs" }),
                "text-muted-foreground hover:bg-stone-200"
              )}
            >
              <PlusIcon className="size-4 " onClick={() => alert("ok")} />
            </span>
          </AccordionTrigger>
          <AccordionContent>Data layers</AccordionContent>
        </AccordionItem>
      </Accordion>
    </DrawerContent>
  );
}
