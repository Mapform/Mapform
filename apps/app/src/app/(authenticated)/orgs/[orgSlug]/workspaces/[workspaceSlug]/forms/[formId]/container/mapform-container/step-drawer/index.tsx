import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@mapform/ui/components/button";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@mapform/ui/components/drawer";
import { ChevronsLeftIcon, GripVerticalIcon, PlusIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@mapform/ui/components/accordion";
import { cn } from "@mapform/lib/classnames";
import type { StepWithLocation } from "@mapform/db/extentsions/steps";
import { DragHandle, DragItem } from "~/components/draggable";
import { useContainerContext } from "../../context";
import { GeneralForm } from "./general-form";
import {
  NewLayerDrawerContent,
  NewLayerDrawerRoot,
  NewLayerDrawerTrigger,
} from "./new-layer-drawer";
import { LayerSubmenu } from "./layer-submenu";

export const StepDrawerRoot = Drawer;
export const StepDrawerTrigger = DrawerTrigger;

export function StepDrawerContent() {
  const { currentStep } = useContainerContext();

  if (!currentStep) {
    return <div className="bg-white w-[400px] border-l" />;
  }

  return <StepDrawerContentInner currentStep={currentStep} />;
}

function StepDrawerContentInner({
  currentStep,
}: {
  currentStep: StepWithLocation;
}) {
  const [dragLayers, setDragLayers] = useState(currentStep.layers);
  const { debouncedUpdateStep } = useContainerContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const reorderLayers = async (e: DragEndEvent) => {
    if (!e.over) return;
    if (e.active.id !== e.over.id) {
      const activeLayerIndex = dragLayers.findIndex(
        (layer) => layer.id === e.active.id
      );
      const overLayerIndex = dragLayers.findIndex(
        (layer) => layer.id === e.over?.id
      );
      if (activeLayerIndex < 0 || overLayerIndex < 0) return;
      const newLayerList = arrayMove(
        dragLayers,
        activeLayerIndex,
        overLayerIndex
      );
      setDragLayers(newLayerList);

      await debouncedUpdateStep({
        stepId: currentStep.id,
        data: {
          formId: currentStep.formId ?? undefined,
          layerOrder: newLayerList.map((layer) => layer.id),
        },
      });
    }
  };

  return (
    <DrawerContent>
      <DrawerHeader className="flex justify-between items-center py-2">
        <h2 className="text-base font-medium">Edit Page</h2>
        <div className="-mr-2">
          <DrawerTrigger asChild>
            <Button size="icon-sm" variant="ghost">
              <ChevronsLeftIcon className="size-4" />
            </Button>
          </DrawerTrigger>
        </div>
      </DrawerHeader>

      <Accordion defaultValue={["item-1", "item-2"]} type="multiple">
        <AccordionItem value="item-1">
          <AccordionHeader>
            <AccordionTrigger>General</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <GeneralForm currentStep={currentStep} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionHeader>
            <AccordionTrigger>
              <span className="flex-1 text-left">Data layers</span>
            </AccordionTrigger>
            <NewLayerDrawerRoot>
              <NewLayerDrawerTrigger>
                <span
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-xs" }),
                    "mr-2 text-muted-foreground hover:bg-stone-200"
                  )}
                >
                  <PlusIcon className="size-4" />
                </span>
              </NewLayerDrawerTrigger>
              <NewLayerDrawerContent setDragLayers={setDragLayers} />
            </NewLayerDrawerRoot>
          </AccordionHeader>
          <AccordionContent>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={reorderLayers}
              sensors={sensors}
            >
              <SortableContext
                items={dragLayers}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {dragLayers.map((layer) => {
                    return (
                      <DragItem id={layer.id} key={layer.id}>
                        <div className="flex items-center py-1">
                          <DragHandle id={layer.id}>
                            <div className="mr-2 flex items-center justify-center flex-shrink-0">
                              <GripVerticalIcon className="h-4 w-4 flex-shrink-0" />
                            </div>
                          </DragHandle>
                          <div className="flex items-center">
                            <span className="flex-1 truncate">
                              {layer.name}
                            </span>
                          </div>
                          <LayerSubmenu
                            layerId={layer.id}
                            setDragLayers={setDragLayers}
                          />
                        </div>
                      </DragItem>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DrawerContent>
  );
}
