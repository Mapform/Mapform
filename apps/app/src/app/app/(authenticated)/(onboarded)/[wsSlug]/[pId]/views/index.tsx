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
} from "lucide-react";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { useProject } from "../context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
} from "~/components/image-uploder";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@mapform/ui/components/carousel";
import Image from "next/image";
import { cn } from "@mapform/lib/classnames";
import { useMap } from "react-map-gl/mapbox";

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

  return (
    <>
      <MapDrawerToolbar>
        <Import>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="ml-auto" variant="ghost" size="icon">
                <EllipsisVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ImportTrigger asChild>
                <DropdownMenuItem>
                  <ImportIcon className="size-4" />
                  Import
                </DropdownMenuItem>
              </ImportTrigger>
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
            </DropdownMenuContent>
            <ImportContent />
          </DropdownMenu>
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
                className="relative h-[200px] w-full flex-shrink-0 p-0"
                key={blob.url}
              >
                <Image
                  className="m-0 size-full"
                  src={blob.url}
                  alt={blob.title ?? ""}
                  fill
                  objectFit="cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : null}
      <div className="z-10 px-6 pb-6">
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
                />
              </ImageUploaderPopover>
              <TooltipContent>Add cover photo</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        <AutoSizeTextArea
          className="text-4xl font-bold"
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
        <div className="mt-2 flex gap-1">
          <Tabs
            className="w-full"
            value={activeView?.id}
            onValueChange={(value) => {
              void setQueryStates({
                viewId: value,
              });
            }}
          >
            <div className="overflow-x-auto">
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
            </div>
            {projectService.optimisticState.views.map((view) => (
              <TabsContent key={view.id} value={view.id}>
                {view.type === "map" ? <MapView /> : <TableView />}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}
