"use client";

import { useAction } from "next-safe-action/hooks";
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
import { updateLayerOrder } from "~/data/layers/update-layer-order";
import { usePage } from "../page-context";
import { Button } from "@mapform/ui/components/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";
import { PlusIcon } from "lucide-react";
import { LayerPopover } from "../layer-popover";

export function LayerList() {
  const { optimisticPage, updatePage } = usePage();

  const dragPageLayers = optimisticPage?.layersToPages;
  const { executeAsync } = useAction(updateLayerOrder);

  if (!dragPageLayers) {
    return null;
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const reorderSteps = async (e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      const activeStepIndex = dragPageLayers?.findIndex(
        (pageLayer) => pageLayer.layerId === e.active.id
      );
      const overStepIndex = dragPageLayers?.findIndex(
        (pageLayer) => pageLayer.layerId === e.over?.id
      );

      if (activeStepIndex < 0 || overStepIndex < 0) return;

      const newPageLayerList = arrayMove(
        dragPageLayers,
        activeStepIndex,
        overStepIndex
      );

      updatePage({
        ...optimisticPage,
        // layersToPages: newPageLayerList,
      });

      // await updatePageOrderAsync({
      //   projectId: optimisticProjectWithPages.id,
      //   pageOrder: newPageList.map((page) => page.id),
      // });
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold leading-6 text-stone-400">
          Layers
        </h3>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <LayerPopover>
              <TooltipTrigger asChild>
                <Button
                  className="ml-auto -mr-2"
                  onClick={() => {}}
                  variant="ghost"
                  size="icon-sm"
                >
                  <PlusIcon className="size-4" />
                </Button>
              </TooltipTrigger>
            </LayerPopover>
            <TooltipContent>New Layer</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-col mt-4">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={reorderSteps}
          sensors={sensors}
        >
          <SortableContext
            items={dragPageLayers.map((pageLayer) => pageLayer.layerId)}
            strategy={verticalListSortingStrategy}
          >
            {dragPageLayers.map((pageLayer) => {
              // return <Item key={pageLayer.layerId} page={page} />;
              return <div>{pageLayer.layer.name}</div>;
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
