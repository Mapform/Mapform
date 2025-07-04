"use client";

import {
  ArrowUpRightIcon,
  EllipsisIcon,
  Settings2Icon,
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
  DropdownMenuSeparator,
} from "@mapform/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mapform/ui/components/alert-dialog";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import type { GetPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarRightMenuButton,
} from "@mapform/ui/components/sidebar";
import { deleteLayerAction } from "~/data/layers/delete-layer";
import { deletePageLayerAction } from "~/data/layers-to-pages/delete-page-layer";
import { DragItem, DragHandle } from "~/components/draggable";
import { useProject } from "../../project-context";
import {
  LayerPopoverRoot,
  LayerPopoverContent,
  LayerPopoverAnchor,
} from "../../layer-popover";
import { LAYERS } from "~/constants/layers";

interface ItemProps {
  layer: NonNullable<
    GetPageWithLayers["data"]
  >["layersToPages"][number]["layer"];
}

export function Item({ layer }: ItemProps) {
  const { currentProject, updatePageServerAction } = useProject();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [layerPopoverOpen, setLayerPopoverOpen] = useState(false);
  const { execute: executeDeleteLayer } = useAction(deleteLayerAction);
  const { execute: executeDeletePageLayer } = useAction(deletePageLayerAction);
  const params = useParams<{ wsSlug: string; tsSlug: string; pId: string }>();

  const isLastPage = currentProject.pages.length <= 1;

  const handleDelete = () => {
    if (!updatePageServerAction.optimisticState) return;

    const newLayers =
      updatePageServerAction.optimisticState.layersToPages.filter(
        (pageLayer) => pageLayer.layerId !== layer.id,
      );

    executeDeleteLayer({
      layerId: layer.id,
    });

    updatePageServerAction.setOptimisticState({
      ...updatePageServerAction.optimisticState,
      layersToPages: newLayers,
    });
  };

  const handleRemoveFromPage = () => {
    if (!updatePageServerAction.optimisticState) return;

    const newLayers =
      updatePageServerAction.optimisticState.layersToPages.filter(
        (pageLayer) => pageLayer.layerId !== layer.id,
      );

    executeDeletePageLayer({
      layerId: layer.id,
      pageId: updatePageServerAction.optimisticState.id,
    });

    // Note: it is not necessary to set isPendingDebounce to true here since we
    // are not debouncing
    updatePageServerAction.setOptimisticState({
      ...updatePageServerAction.optimisticState,
      layersToPages: newLayers,
    });
  };

  const Icon = LAYERS[layer.type].icon;

  return (
    <DragItem id={layer.id} key={layer.id}>
      <ContextMenu>
        <ContextMenuTrigger>
          <DragHandle id={layer.id}>
            <SidebarMenuItem>
              <SidebarRightMenuButton
                className="pr-8"
                onClick={() => {
                  setLayerPopoverOpen(true);
                }}
              >
                <Icon />
                <span className="truncate text-sm">
                  {layer.name || "Untitled"}
                </span>
              </SidebarRightMenuButton>
              <AlertDialog>
                <DropdownMenu
                  modal
                  onOpenChange={setDropdownOpen}
                  open={dropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction>
                      <EllipsisIcon />
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-[200px] overflow-hidden"
                    side="left"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2"
                      >
                        <Link
                          href={`/app/${params.wsSlug}/${params.tsSlug}/datasets/${layer.datasetId}`}
                        >
                          <ArrowUpRightIcon className="size-4 flex-shrink-0" />
                          View Dataset
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onSelect={handleRemoveFromPage}
                      >
                        <UnlinkIcon className="size-4 flex-shrink-0" />
                        Disconnect
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onSelect={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          setLayerPopoverOpen(true);
                        }}
                      >
                        <Settings2Icon className="size-4 flex-shrink-0" />
                        Edit
                      </DropdownMenuItem>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onSelect={(e) => {
                            e.preventDefault();
                            setDropdownOpen(false);
                          }}
                        >
                          <Trash2Icon className="size-4 flex-shrink-0" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This layer will be permanently deleted on every page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SidebarMenuItem>
          </DragHandle>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled={isLastPage} onClick={handleDelete}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <LayerPopoverRoot
        modal
        onOpenChange={setLayerPopoverOpen}
        open={layerPopoverOpen}
      >
        <LayerPopoverAnchor />
        <LayerPopoverContent
          layerToEdit={layer}
          side="left"
          onClose={() => {
            setLayerPopoverOpen(false);
          }}
        />
      </LayerPopoverRoot>
    </DragItem>
  );
}
