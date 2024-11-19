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
import { Spinner } from "@mapform/ui/components/spinner";
import { useMapform } from "@mapform/mapform";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@mapform/ui/components/sidebar";
import { PlusIcon } from "lucide-react";
import { updatePageOrderAction } from "~/data/pages/update-page-order";
import { createPageAction } from "~/data/pages/create-page";
import { useProject } from "../../project-context";
import { usePage } from "../../page-context";
import { Item } from "./item";

export function PageList() {
  const { map } = useMapform();
  const { setActivePage } = usePage();
  const { optimisticProjectWithPages, updateProjectWithPages } = useProject();

  const dragPages = optimisticProjectWithPages.pages;
  const { executeAsync: updatePageOrderAsync } = useAction(
    updatePageOrderAction,
  );
  const { execute: executeCreatePage, status: createPageStatus } = useAction(
    createPageAction,
    {
      onSuccess: (newPage) => {
        const newPageData = newPage.data;

        if (!newPageData) return;

        setActivePage(newPageData);
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
      updateProjectWithPages({
        ...optimisticProjectWithPages,
        pages: newPageList,
      });

      await updatePageOrderAsync({
        projectId: optimisticProjectWithPages.id,
        pageOrder: newPageList.map((page) => page.id),
      });
    }
  };

  return (
    <SidebarContent className="h-full">
      <SidebarGroup className="h-full">
        <SidebarGroupLabel>Pages</SidebarGroupLabel>
        <SidebarGroupAction
          disabled={createPageStatus === "executing"}
          onClick={() => {
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
              projectId: optimisticProjectWithPages.id,
              center: { x: loc.lng, y: loc.lat },
              zoom,
              pitch,
              bearing,
            });
          }}
          title="Add Page"
        >
          {createPageStatus === "executing" ? (
            <Spinner size="sm" variant="dark" />
          ) : (
            <PlusIcon />
          )}
          <span className="sr-only">Add Project</span>
        </SidebarGroupAction>
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
