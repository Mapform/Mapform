"use client";

import {
  EllipsisIcon,
  FileIcon,
  Layers2Icon,
  Trash2Icon,
  UnlinkIcon,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mapform/ui/components/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { startTransition } from "react";
import { Button } from "@mapform/ui/components/button";
import { cn } from "@mapform/lib/classnames";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { deleteLayer } from "~/data/layers/delete-layer";
import { deletePageLayer } from "~/data/layers-to-pages/delete-page-layer";
import { DragItem, DragHandle } from "~/components/draggable";
import { usePage } from "../../page-context";
import { useProject } from "../../project-context";

interface ItemProps {
  layer: any;
}

export function Item({ layer }: ItemProps) {
  const { optimisticPage, updatePage } = usePage();
  const { optimisticProjectWithPages } = useProject();
  const { execute: executeDeleteLayer } = useAction(deleteLayer);
  const { execute: executeDeletePageLayer } = useAction(deletePageLayer);

  const isLastPage = optimisticProjectWithPages.pages.length <= 1;
  // const isActive = page.id === optimisticPage?.id;

  const handleDelete = () => {
    if (!optimisticPage) return;

    const newLayers = optimisticPage.layersToPages.filter(
      (pageLayer) => pageLayer.layerId !== layer.id,
    );

    executeDeleteLayer({
      layerId: layer.id,
    });

    startTransition(() => {
      updatePage({
        ...optimisticPage,
        layersToPages: newLayers,
      });
    });
  };

  const handleRemoveFromPage = () => {
    if (!optimisticPage) return;

    const newLayers = optimisticPage.layersToPages.filter(
      (pageLayer) => pageLayer.layerId !== layer.id,
    );

    executeDeletePageLayer({
      layerId: layer.id,
      pageId: optimisticPage.id,
    });

    startTransition(() => {
      updatePage({
        ...optimisticPage,
        layersToPages: newLayers,
      });
    });
  };

  return (
    <DragItem id={layer.id} key={layer.id}>
      <ContextMenu>
        <ContextMenuTrigger>
          <DragHandle id={layer.id}>
            <div
              className={cn(
                "group -mx-2 mb-[2px] flex cursor-pointer items-center justify-between rounded pr-2 transition-colors hover:bg-stone-100",
                {
                  // "bg-stone-100": isActive,
                },
              )}
            >
              <div className="-mr-1 flex flex-1 items-center overflow-hidden">
                <button
                  className="flex flex-1 items-center gap-2 overflow-hidden py-1.5 pl-2"
                  onClick={() => {
                    // setActivePage(page);
                  }}
                >
                  <Layers2Icon className="flex size-4 flex-shrink-0 items-center justify-center" />
                  <span className="truncate text-sm">
                    {layer.name || "Untitled"}
                  </span>
                </button>
                <DropdownMenu>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="!ring-0 !ring-transparent !ring-opacity-0 !ring-offset-0 hover:bg-stone-200"
                            size="icon-xs"
                            variant="ghost"
                          >
                            <EllipsisIcon className="invisible flex size-4 flex-shrink-0 items-center justify-center transition-opacity group-hover:visible" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <DropdownMenuContent className="w-[200px] overflow-hidden">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={handleRemoveFromPage}
                          >
                            <UnlinkIcon className="size-4 flex-shrink-0" />
                            Remove from page
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={handleDelete}
                          >
                            <Trash2Icon className="size-4 flex-shrink-0" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                      <TooltipContent side="bottom">
                        Delete or edit
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </DropdownMenu>
              </div>
            </div>
          </DragHandle>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled={isLastPage} onClick={handleDelete}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </DragItem>
  );
}
