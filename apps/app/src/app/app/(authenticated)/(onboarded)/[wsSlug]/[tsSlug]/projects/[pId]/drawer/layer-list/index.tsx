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
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@mapform/ui/components/sidebar";
import { updateLayerOrderAction } from "~/data/layers/update-layer-order";
import { createPageLayerAction } from "~/data/layers-to-pages/create-page-layer";
import { useProject } from "../../project-context";
import {
  LayerPopoverRoot,
  LayerPopoverContent,
  LayerPopoverAnchor,
} from "../../layer-popover";
import { Item } from "./item";

export function LayerList() {
  const { currentProject, updatePageServerAction } = useProject();
  const [open, setOpen] = useState(false);
  const [layerPopoverOpen, setLayerPopoverOpen] = useState(false);
  const [query, setQuery] = useState<string>("");

  const dragLayers = updatePageServerAction.optimisticState?.layersToPages.map(
    (ltp) => ltp.layer,
  );
  const { executeAsync } = useAction(updateLayerOrderAction);
  const { execute: executeCreatePageLayer } = useAction(createPageLayerAction, {
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

  const layersFromOtherPages = currentProject.pageLayers
    .filter((l) => l.pageId !== updatePageServerAction.optimisticState?.id)
    .filter((l) => !dragLayers?.find((dl) => dl.id === l.layerId))
    // filter for uniqueness
    .filter((l, i, arr) => arr.findIndex((a) => a.layerId === l.layerId) === i);

  if (!dragLayers) {
    return null;
  }

  const reorderLayers = async (e: DragEndEvent) => {
    if (!e.over || !updatePageServerAction.optimisticState?.id) return;

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

      updatePageServerAction.setOptimisticState({
        ...updatePageServerAction.optimisticState,
        layersToPages:
          updatePageServerAction.optimisticState.layersToPages.sort((a, b) => {
            const aIndex = newLayerList.findIndex((l) => l.id === a.layer.id);
            const bIndex = newLayerList.findIndex((l) => l.id === b.layer.id);

            return aIndex - bIndex;
          }),
      });

      await executeAsync({
        pageId: updatePageServerAction.optimisticState.id,
        layerOrder: newLayerList.map((layer) => layer.id),
      });
    }
  };

  const handleCreatePageLayer = (layerId: string) => {
    if (!updatePageServerAction.optimisticState) return;

    executeCreatePageLayer({
      layerId,
      pageId: updatePageServerAction.optimisticState.id,
    });
  };

  return (
    <SidebarContent className="h-full">
      <SidebarGroup className="h-full">
        <SidebarGroupLabel>Layers</SidebarGroupLabel>
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
          <PopoverTrigger asChild>
            <SidebarGroupAction>
              <PlusIcon />
            </SidebarGroupAction>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-[200px] p-0" side="right">
            <Command
              filter={(value, search, keywords) => {
                if (value.includes("Create")) return 1;
                if (
                  value.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                )
                  return 1;
                if (
                  keywords?.some((k) =>
                    k.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
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
                placeholder="Search or create..."
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
                      <p className="flex items-center font-semibold whitespace-nowrap">
                        <PlusIcon className="mr-2 size-4" />
                        New layer
                      </p>
                      <p className="block ml-1 truncate text-primary">
                        {query}
                      </p>
                    </div>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                {layersFromOtherPages.length > 0 ? (
                  <CommandGroup heading="Connect existing layer">
                    {layersFromOtherPages.map((layer) => (
                      <CommandItem
                        key={layer.layerId}
                        keywords={[layer.name ?? "Untitled"]}
                        onSelect={() => {
                          handleCreatePageLayer(layer.layerId);
                        }}
                        value={layer.layerId}
                      >
                        <div className="flex items-center overflow-hidden">
                          <Layers2Icon className="flex-shrink-0 mr-2 size-4" />
                          <span className="truncate">
                            {layer.name ?? "Untitled"}
                          </span>
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
          <LayerPopoverContent
            initialName={query}
            key={query}
            onClose={() => {
              setLayerPopoverOpen(false);
            }}
          />
        </LayerPopoverRoot>
        <SidebarGroupContent>
          <SidebarMenu>
            {dragLayers.length ? (
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
            ) : (
              <SidebarMenuItem>
                <div className="flex flex-col items-center py-4 rounded-md bg-sidebar-accent text-muted-foreground">
                  <p className="text-sm text-center">No layers added</p>
                </div>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
