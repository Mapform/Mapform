import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@mapform/ui/components/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@mapform/ui/components/accordion";
import { ChevronsLeftIcon, PlusIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { useContainerContext } from "../context";
import {
  NewLayerDrawerRoot,
  NewLayerDrawerContent,
  NewLayerDrawerTrigger,
} from "./new-layer-drawer";
import { GeneralForm } from "./general-form";

export const DatatrackDrawerRoot = Drawer;
export const DatatrackTrigger = DrawerTrigger;

export function DatatrackContent() {
  const { currentDataTrack } = useContainerContext();

  if (!currentDataTrack) {
    return null;
  }

  return (
    <DrawerContent>
      <DrawerHeader className="flex justify-between items-center py-2">
        <h2 className="text-base font-medium">Edit Datatrack</h2>
        <div className="-mr-2">
          <DrawerTrigger asChild>
            <Button size="icon-sm" variant="ghost">
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
        </div>
      </DrawerHeader>
      <NewLayerDrawerRoot>
        <Accordion defaultValue={["item-1"]} type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>
              <GeneralForm currentDataTrack={currentDataTrack} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <NewLayerDrawerContent />
      </NewLayerDrawerRoot>
    </DrawerContent>
  );
}
