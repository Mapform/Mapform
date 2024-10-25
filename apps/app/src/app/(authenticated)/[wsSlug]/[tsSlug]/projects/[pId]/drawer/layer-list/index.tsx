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
import { Layers2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { updateLayerOrder } from "~/data/layers/update-layer-order";
import { createPageLayer } from "~/data/layers-to-pages/create-page-layer";
import { usePage } from "../../page-context";
import { useProject } from "../../project-context";
import {
  LayerPopoverRoot,
  LayerPopoverContent,
  LayerPopoverAnchor,
} from "../../layer-popover";
import { Item } from "./item";

export function LayerList() {
  const { optimisticProjectWithPages } = useProject();
  const { optimisticPage, updatePage } = usePage();
  const [open, setOpen] = useState(false);
  const [layerPopoverOpen, setLayerPopoverOpen] = useState(false);
  const [query, setQuery] = useState<string>("");

  const dragLayers = optimisticPage?.layersToPages.map((ltp) => ltp.layer);
  const { executeAsync } = useAction(updateLayerOrder);
  const { execute: executeCreatePageLayer } = useAction(createPageLayer, {
    onSuccess: () => {
      setLayerPopoverOpen(false);
    },
  });

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
          <Popover
            modal
            onOpenChange={(val) => {
              setOpen(val);
              if (val) {
                setQuery("");
              }
            }}
            open={open}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    className="-mr-2 ml-auto"
                    size="icon-sm"
                    variant="ghost"
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>New Layer</TooltipContent>
            </Tooltip>
            <PopoverContent
              align="start"
              className="w-[200px] p-0"
              side="right"
            >
              <Command
                filter={(value, search, keywords) => {
                  if (value.includes("Create")) return 1;
                  if (
                    value
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  )
                    return 1;
                  if (
                    keywords?.some((k) =>
                      k
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase()),
                    )
                  )
                    return 1;
                  return 0;
                }}
              >
                <CommandInput
                  onValueChange={(value: string) => {
                    setQuery(value);
                  }}
                  placeholder="Create or search..."
                  value={query}
                />
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setLayerPopoverOpen(true);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center overflow-hidden">
                        <p className="flex items-center font-semibold">
                          <PlusIcon className="mr-2 size-4" />
                          Create
                        </p>
                        <p className="text-primary ml-1 block truncate">
                          {query}
                        </p>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  {layersFromOtherPages.length > 0 ? (
                    <CommandGroup heading="Layers">
                      {layersFromOtherPages.map((layer) => (
                        <CommandItem
                          key={layer.id}
                          keywords={[layer.name ?? "Untitled"]}
                          onSelect={() => {
                            handleCreatePageLayer(layer.id);
                          }}
                          value={layer.id}
                        >
                          <div className="flex items-center overflow-hidden truncate">
                            <Layers2Icon className="mr-2 size-4" />
                            {layer.name ?? "Untitled"}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <LayerPopoverRoot
            modal
            onOpenChange={setLayerPopoverOpen}
            open={layerPopoverOpen}
          >
            <LayerPopoverAnchor />
            <LayerPopoverContent initialName={query} key={query} />
          </LayerPopoverRoot>
        </TooltipProvider>
      </div>
      <div className="mt-1 flex flex-col">
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
