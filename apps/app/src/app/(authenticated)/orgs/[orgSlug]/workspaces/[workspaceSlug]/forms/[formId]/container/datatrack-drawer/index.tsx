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
import { useState } from "react";
import { ChevronsLeftIcon, PlusIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { useContainerContext } from "../context";
import { NewLayerSidebar } from "./new-layer-sidebar";

export const DatatrackDrawerRoot = Drawer;
export const DatatrackTrigger = DrawerTrigger;

export function DatatrackContent() {
  const [showNewLayerSidebar, setShowNewLayerSidebar] = useState(false);
  const { currentDataTrack, setCurrentDataTrack } = useContainerContext();

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
      {/* {showNewLayerSidebar ? (
        <NewLayerSidebar setShowNewLayerSidebar={setShowNewLayerSidebar} />
      ) : null}
      <div className="p-4 border-b">
        <Button
          onClick={() => {
            setCurrentDataTrack(undefined);
          }}
          size="sm"
          variant="secondary"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Close
        </Button>
      </div> */}
      <Accordion defaultValue={["item-1"]} type="multiple">
        <AccordionItem className="border-b" value="item-1">
          <AccordionTrigger className="px-4">
            <div className="flex flex-1 justify-between">
              <h3 className="text-xs font-semibold leading-6 mb-0">Layers</h3>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNewLayerSidebar(true);
                }}
                size="icon"
                variant="ghost"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            {currentDataTrack?.layers.map((layer) => (
              <div className="capitalize" key={layer.id}>
                {layer.name ?? `${layer.type.toLocaleLowerCase()} layer`}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DrawerContent>
  );
}
