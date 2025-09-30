"use client";

import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { Button } from "@mapform/ui/components/button";
import {
  PlusIcon,
  SmilePlusIcon,
  Trash2Icon,
  EllipsisVerticalIcon,
  ImportIcon,
  ImagePlusIcon,
  ScanIcon,
  PencilIcon,
} from "lucide-react";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { useProject } from "../context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@mapform/ui/components/dropdown-menu";
import { VIEWS } from "~/constants/views";
import { useAction } from "next-safe-action/hooks";
import { createViewAction } from "~/data/views/create-view";
import { MapDrawerToolbar } from "~/components/map-drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@mapform/ui/components/tabs";
import { MapView } from "./map-view";
import { TableView } from "./table-view";
import { Import, ImportContent, ImportTrigger } from "./import";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mapform/ui/components/context-menu";
import { toast } from "@mapform/ui/components/toaster";
import { deleteViewAction } from "~/data/views/delete-view";
import { useParamsContext } from "~/lib/params/client";
import {
  ImageUploaderPopover,
  ImageUploaderTrigger,
  ImageUploaderContent,
  ImageUploaderAnchor,
} from "~/components/image-uploder";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@mapform/ui/components/carousel";
import Image from "next/image";
import { cn } from "@mapform/lib/classnames";
import { useMap } from "react-map-gl/maplibre";
import { ImageLightbox } from "~/components/image-lightbox";
import { deleteImageAction } from "~/data/images/delete-image";
import { useState } from "react";
import {
  DeleteProject,
  DeleteProjectContent,
  DeleteProjectTrigger,
} from "~/components/delete-project";

export function Views() {
  const map = useMap();
  const { projectService, activeView } = useProject();
  const { setQueryStates } = useParamsContext();
  const { execute, isPending } = useAction(createViewAction);

  const { execute: executeDeleteView, isPending: isDeletingView } = useAction(
    deleteViewAction,
    {
      onError: ({ error }) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description:
            error.serverError ?? "There was an error updating the page.",
        });
      },
    },
  );

  const { executeAsync: deleteImageAsync, isPending: isPendingDeleteImage } =
    useAction(deleteImageAction, {
      onError: ({ error }) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description:
            error.serverError ?? "There was an error deleting the image.",
          variant: "destructive",
        });
      },
    });

  const [openUploaderForUrl, setOpenUploaderForUrl] = useState<string | null>(
    null,
  );

  return (
    <>
      <MapDrawerToolbar>
        <Import>
          <DeleteProject>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button className="ml-auto" variant="ghost" size="icon-sm">
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* TODO: Renable when imports working again */}
                {/* <ImportTrigger asChild>
                <DropdownMenuItem>
                  <ImportIcon className="size-4" />
                  Import
                </DropdownMenuItem>
              </ImportTrigger> */}
                <DropdownMenuItem
                  onClick={() => {
                    projectService.execute({
                      ...projectService.optimisticState,
                      id: projectService.optimisticState.id,
                      center: {
                        coordinates: map.current?.getCenter().toArray() as [
                          number,
                          number,
                        ],
                      },
                      pitch: map.current?.getPitch(),
                      bearing: map.current?.getBearing(),
                      zoom: map.current?.getZoom(),
                    });
                  }}
                >
                  <ScanIcon className="size-4" />
                  Set Default View
                </DropdownMenuItem>
                <DeleteProjectTrigger asChild>
                  <DropdownMenuItem>
                    <Trash2Icon className="size-4" /> Delete
                  </DropdownMenuItem>
                </DeleteProjectTrigger>
              </DropdownMenuContent>
              <ImportContent />
            </DropdownMenu>
            <DeleteProjectContent
              project={{
                id: projectService.optimisticState.id,
                teamspaceId: projectService.optimisticState.teamspaceId,
              }}
            />
          </DeleteProject>
        </Import>
        {/* <Button className="ml-auto" variant="ghost" size="icon">
          <XIcon className="size-4" />
        </Button> */}
      </MapDrawerToolbar>
      {projectService.optimisticState.blobs.length ? (
        <Carousel className="m-0 mb-4">
          <CarouselContent className="m-0">
            {projectService.optimisticState.blobs.map((blob) => (
              <CarouselItem
                className="group relative h-[200px] w-full flex-shrink-0 p-0"
                key={blob.url}
              >
                <ImageLightbox
                  activeImage={{
                    url: blob.url,
                    description: blob.description ?? undefined,
                    license: blob.license ?? undefined,
                    licenseUrl: blob.licenseUrl ?? undefined,
                    sourceUrl: blob.sourceUrl ?? undefined,
                    author: blob.author ?? undefined,
                    source: "internal",
                  }}
                >
                  <Image
                    className="m-0 size-full"
                    src={blob.url}
                    alt={blob.description ?? ""}
                    fill
                    objectFit="cover"
                  />
                </ImageLightbox>
                <ImageUploaderPopover
                  modal
                  open={openUploaderForUrl === blob.url}
                  onOpenChange={(isOpen) =>
                    setOpenUploaderForUrl(isOpen ? blob.url : null)
                  }
                >
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <ImageUploaderAnchor asChild>
                        <Button
                          className={cn(
                            "absolute right-3 top-3 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100",
                            openUploaderForUrl === blob.url && "opacity-100",
                          )}
                          size="icon-sm"
                          type="button"
                          variant="outline"
                        >
                          <PencilIcon className="size-4" />
                        </Button>
                      </ImageUploaderAnchor>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <ImageUploaderTrigger asChild>
                        <DropdownMenuItem>
                          <ImagePlusIcon className="size-4" /> New cover photo
                        </DropdownMenuItem>
                      </ImageUploaderTrigger>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={isPendingDeleteImage}
                        onClick={() => deleteImageAsync({ url: blob.url })}
                      >
                        <Trash2Icon className="size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ImageUploaderContent
                    projectId={projectService.optimisticState.id}
                    onUploadSuccess={() => {
                      setOpenUploaderForUrl(null);
                    }}
                  />
                </ImageUploaderPopover>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : null}
      <div className="z-10 flex flex-1 flex-col px-6 pb-6">
        <div>
          <Tooltip>
            {projectService.optimisticState.icon ? (
              <div
                className={cn("relative z-10 mb-2", {
                  "-mt-12": projectService.optimisticState.blobs.length,
                })}
              >
                <EmojiPopover
                  onIconChange={(emoji) => {
                    projectService.execute({
                      ...projectService.optimisticState,
                      id: projectService.optimisticState.id,
                      icon: emoji,
                    });
                  }}
                >
                  <TooltipTrigger asChild>
                    <button
                      className="rounded-lg text-6xl hover:bg-gray-200/50"
                      type="button"
                    >
                      {projectService.optimisticState.icon}
                    </button>
                  </TooltipTrigger>
                </EmojiPopover>
              </div>
            ) : (
              <EmojiPopover
                onIconChange={(emoji) => {
                  projectService.execute({
                    ...projectService.optimisticState,
                    id: projectService.optimisticState.id,
                    icon: emoji,
                  });
                }}
              >
                <TooltipTrigger asChild>
                  <Button size="icon-sm" type="button" variant="ghost">
                    <SmilePlusIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
              </EmojiPopover>
            )}
            <TooltipContent>Add emoji</TooltipContent>
          </Tooltip>
          {!projectService.optimisticState.blobs.length ? (
            <Tooltip>
              <ImageUploaderPopover>
                <ImageUploaderTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <ImagePlusIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                </ImageUploaderTrigger>
                <ImageUploaderContent
                  projectId={projectService.optimisticState.id}
                  onUploadSuccess={() => {
                    setOpenUploaderForUrl(null);
                  }}
                />
              </ImageUploaderPopover>
              <TooltipContent>Add cover photo</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        <AutoSizeTextArea
          className="mb-2 text-3xl font-bold"
          placeholder="Untitled"
          value={projectService.optimisticState.name ?? ""}
          onChange={(value) => {
            projectService.execute({
              ...projectService.optimisticState,
              id: projectService.optimisticState.id,
              name: value,
            });
          }}
        />
        <AutoSizeTextArea
          placeholder="Description"
          value={projectService.optimisticState.description ?? ""}
          onChange={(value) => {
            projectService.execute({
              ...projectService.optimisticState,
              id: projectService.optimisticState.id,
              description: value,
            });
          }}
        />
        <div className="mt-2 flex flex-1 flex-col gap-1">
          <Tabs
            className="flex w-full flex-1 flex-col"
            value={activeView?.id}
            onValueChange={(value) => {
              void setQueryStates({
                viewId: value,
              });
            }}
          >
            {/* TODO: Re-enable when Table view is ready */}
            {/* <div className="overflow-x-auto">
              <TabsList>
                {projectService.optimisticState.views.map((view) => (
                  <ContextMenu key={view.id}>
                    <TabsTrigger value={view.id}>
                      <ContextMenuTrigger>
                        {view.name ?? VIEWS[view.type].name}
                      </ContextMenuTrigger>
                    </TabsTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        disabled={isDeletingView}
                        onClick={() => {
                          executeDeleteView({ viewId: view.id });
                        }}
                      >
                        <Trash2Icon className="mr-2 size-4" />
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" variant="ghost">
                          <PlusIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Add View</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      disabled={isPending}
                      onClick={() => {
                        execute({
                          projectId: projectService.optimisticState.id,
                          viewType: "map",
                        });
                      }}
                    >
                      <VIEWS.map.icon className="size-4" />
                      <span>{VIEWS.map.name} View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        execute({
                          projectId: projectService.optimisticState.id,
                          viewType: "table",
                        });
                      }}
                    >
                      <VIEWS.table.icon className="size-4" />
                      <span>{VIEWS.table.name} View</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TabsList>
            </div> */}
            {projectService.optimisticState.views.map((view) => (
              <TabsContent
                className="flex flex-1 flex-col empty:hidden"
                key={view.id}
                value={view.id}
              >
                {view.type === "map" ? <MapView /> : <TableView />}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}
