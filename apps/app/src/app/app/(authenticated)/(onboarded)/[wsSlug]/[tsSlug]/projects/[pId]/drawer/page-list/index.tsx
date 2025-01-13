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
import { useMapform } from "@mapform/mapform";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@mapform/ui/components/sidebar";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { FileIcon, FlagIcon, type LucideIcon, PlusIcon } from "lucide-react";
import { updatePageOrderAction } from "~/data/pages/update-page-order";
import { createPageAction } from "~/data/pages/create-page";
import { useProject } from "../../project-context";
import { Item } from "./item";
import { toast } from "@mapform/ui/components/toaster";
import type { Page } from "@mapform/db/schema";
import { useState } from "react";

const pages: {
  name: string;
  icon: LucideIcon;
  pageType: Page["pageType"];
}[] = [
  {
    name: "Page",
    icon: FileIcon,
    pageType: "page",
  },
  {
    name: "End Screen",
    icon: FlagIcon,
    pageType: "page_ending",
  },
];

export function PageList() {
  const { map } = useMapform();
  const [open, setOpen] = useState(false);
  const { currentProject, updateProjectOptimistic, setActivePage } =
    useProject();

  const dragPages = currentProject.pages;
  const { executeAsync: updatePageOrderAsync } = useAction(
    updatePageOrderAction,
  );
  const { execute: executeCreatePage, isPending: createIsPending } = useAction(
    createPageAction,
    {
      onSuccess: (newPage) => {
        const newPageData = newPage.data;

        if (!newPageData) return;

        setActivePage(newPageData);
      },
      onError: ({ error }) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.serverError,
        });
      },
    },
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const reorderSteps = async (e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      const activeStepIndex = dragPages.findIndex(
        (page) => page.id === e.active.id,
      );
      const overStepIndex = dragPages.findIndex(
        (page) => page.id === e.over?.id,
      );

      if (activeStepIndex < 0 || overStepIndex < 0) return;

      const newPageList = arrayMove(dragPages, activeStepIndex, overStepIndex);
      updateProjectOptimistic({
        ...currentProject,
        pages: newPageList,
      });

      await updatePageOrderAsync({
        projectId: currentProject.id,
        pageOrder: newPageList.map((page) => page.id),
      });
    }
  };

  return (
    <SidebarContent className="h-full">
      <SidebarGroup>
        <SidebarGroupLabel>Pages</SidebarGroupLabel>
        {/* This is a combobox instead of a dropdown because I may want to add to this over time */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarGroupAction>
              <PlusIcon />
            </SidebarGroupAction>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[200px] p-0" side="right">
            <Command>
              <CommandList>
                <CommandGroup>
                  {pages.map((page) => (
                    <CommandItem
                      key={page.name}
                      className="flex items-center gap-2"
                      disabled={createIsPending}
                      onSelect={() => {
                        const loc = map?.getCenter();
                        const zoom = map?.getZoom();
                        const pitch = map?.getPitch();
                        const bearing = map?.getBearing();

                        if (
                          !loc ||
                          zoom === undefined ||
                          pitch === undefined ||
                          bearing === undefined
                        )
                          return;

                        executeCreatePage({
                          projectId: currentProject.id,
                          center: { x: loc.lng, y: loc.lat },
                          zoom,
                          pitch,
                          bearing,
                          pageType: page.pageType,
                        });
                      }}
                    >
                      <page.icon className="size-4" /> {page.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <SidebarGroupContent>
          <SidebarMenu>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={reorderSteps}
              sensors={sensors}
            >
              <SortableContext
                items={dragPages}
                strategy={verticalListSortingStrategy}
              >
                {dragPages.map((page) => {
                  return <Item key={page.id} page={page} />;
                })}
              </SortableContext>
            </DndContext>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
