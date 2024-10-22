"use client";

import { startTransition } from "react";
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
import { LinkIcon, PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { updateLayerOrder } from "~/data/layers/update-layer-order";
import { createPageLayer } from "~/data/layers-to-pages/create-page-layer";
import { usePage } from "../../page-context";
import { useProject } from "../../project-context";
import { LayerPopover } from "../../layer-popover";
import { Item } from "./item";

export function LayerList() {
  const { optimisticProjectWithPages } = useProject();
  const { optimisticPage, updatePage } = usePage();

  const dragLayers = optimisticPage?.layersToPages.map((ltp) => ltp.layer);
  const { executeAsync } = useAction(updateLayerOrder);
  const { execute: executeCreatePageLayer } = useAction(createPageLayer);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const layersFromOtherPages = optimisticProjectWithPages.layers
    .filter((l) => l.pageId !== optimisticPage?.id)
    .filter((l) => !dragLayers?.find((dl) => dl.id === l.id));

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

  const handleCreatePageLayer = (layerId: string) => {
    if (!optimisticPage) return;

    executeCreatePageLayer({
      layerId,
      pageId: optimisticPage.id,
    });
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold leading-6 text-stone-400">
          Layers
        </h3>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    className="-mr-2 ml-auto"
                    size="icon-sm"
                    variant="ghost"
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <TooltipContent>New Layer</TooltipContent>
              <DropdownMenuContent>
                <LayerPopover>
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <PlusIcon className="size-4 flex-shrink-0" />
                    Create new layer
                  </DropdownMenuItem>
                </LayerPopover>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    className="flex items-center gap-2"
                    disabled={!layersFromOtherPages.length}
                  >
                    <LinkIcon className="size-4 flex-shrink-0" />
                    Connect existing layer
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {layersFromOtherPages.map((layer) => {
                        return (
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            key={layer.id}
                            onSelect={() => {
                              handleCreatePageLayer(layer.id);
                            }}
                          >
                            {layer.name || "Untitled"}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
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
