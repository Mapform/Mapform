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
import { Spinner } from "@mapform/ui/components/spinner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@mapform/ui/components/tooltip";
import { useMapform } from "@mapform/mapform";
import { PlusIcon } from "lucide-react";
import { updatePageOrder } from "~/data/pages/update-page-order";
import { createPage } from "~/data/pages/create-page";
import { useProject } from "../../project-context";
import { usePage } from "../../page-context";
import { Item } from "./item";

export function PageList() {
  const { map } = useMapform();
  const { setActivePage } = usePage();
  const { optimisticProjectWithPages, updateProjectWithPages } = useProject();

  const dragPages = optimisticProjectWithPages.pages;
  const { executeAsync: updatePageOrderAsync } = useAction(updatePageOrder);
  const { execute: executeCreatePage, status: createPageStatus } = useAction(
    createPage,
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
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold leading-6 text-stone-400">
          Pages
        </h3>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="-mr-2 ml-auto"
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
                size="icon-sm"
                variant="ghost"
              >
                {createPageStatus === "executing" ? (
                  <Spinner className="size-4" variant="dark" />
                ) : (
                  <PlusIcon className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Page</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-1 flex flex-col">
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
      </div>
    </div>
  );
}
