import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@mapform/ui/components/accordion";
import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { useContainerContext } from "../../context";
import { NewLayerSidebar } from "./new-layer-sidebar";

export function DataSidebar() {
  const [showNewLayerSidebar, setShowNewLayerSidebar] = useState(false);
  const { currentDataTrack, setCurrentDataTrack } = useContainerContext();

  return (
    <div className="absolute inset-0 bg-white z-10">
      {showNewLayerSidebar ? (
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
      </div>
      <Accordion defaultValue={["item-1"]} type="multiple">
        <AccordionItem className="border-b" value="item-2">
          <AccordionTrigger className="px-4">
            <h3 className="text-xs font-semibold leading-6 text-gray-400 mb-0">
              Layers
            </h3>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Button
              onClick={() => {
                setShowNewLayerSidebar(true);
              }}
              size="sm"
              variant="secondary"
            >
              Add
            </Button>
            {currentDataTrack?.layers.map((layer) => (
              <div className="capitalize" key={layer.id}>
                {layer.name ?? `${layer.type.toLocaleLowerCase()} layer`}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
