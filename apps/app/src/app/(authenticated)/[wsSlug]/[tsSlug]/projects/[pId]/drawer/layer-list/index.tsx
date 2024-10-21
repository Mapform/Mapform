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
import { Button } from "@mapform/ui/components/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";
import { PlusIcon } from "lucide-react";
import { updateLayerOrder } from "~/data/layers/update-layer-order";
import { usePage } from "../../page-context";
import { LayerPopover } from "../../layer-popover";
import { Item } from "./item";

export function LayerList() {
  const { optimisticPage, updatePage } = usePage();

  const dragLayers = optimisticPage?.layersToPages.map((ltp) => ltp.layer);
  const { executeAsync } = useAction(updateLayerOrder);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  if (!dragLayers) {
    return null;
  }

  const reorderLayers = async (e: DragEndEvent) => {
    if (!e.over || !optimisticPage?.id) return;

    if (e.active.id !== e.over.id) {
      const activeLayerIndex = dragLayers.findIndex(
        (layer) => layer.id === e.active.id,
      );
      const overLayerIndex = dragLayers.findIndex(
        (layer) => layer.id === e.over?.id,
      );

      if (activeLayerIndex < 0 || overLayerIndex < 0) return;

      const newLayerList = arrayMove(
        dragLayers,
        activeLayerIndex,
        overLayerIndex,
      );

      updatePage({
        ...optimisticPage,
        layersToPages: optimisticPage.layersToPages.sort((a, b) => {
          const aIndex = newLayerList.findIndex((l) => l.id === a.layer.id);
          const bIndex = newLayerList.findIndex((l) => l.id === b.layer.id);

          return aIndex - bIndex;
        }),
      });

      await executeAsync({
        pageId: optimisticPage.id,
        layerOrder: newLayerList.map((layer) => layer.id),
      });
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold leading-6 text-stone-400">
          Layers
        </h3>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <LayerPopover>
              <TooltipTrigger asChild>
                <Button
                  className="-mr-2 ml-auto"
                  size="icon-sm"
                  variant="ghost"
                >
                  <PlusIcon className="size-4" />
                </Button>
              </TooltipTrigger>
            </LayerPopover>
            <TooltipContent>New Layer</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-4 flex flex-col">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={reorderLayers}
          sensors={sensors}
        >
          <SortableContext
            items={dragLayers}
            strategy={verticalListSortingStrategy}
          >
            {dragLayers.map((layer) => {
              return <Item key={layer.id} layer={layer} />;
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
