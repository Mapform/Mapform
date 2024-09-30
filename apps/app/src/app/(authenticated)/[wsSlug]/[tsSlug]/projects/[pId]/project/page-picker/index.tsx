import { PanelLeftIcon, SquarePlusIcon } from "lucide-react";
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
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useMap } from "@mapform/mapform";
import { createPage } from "~/data/pages/create-page";
import { updatePageOrder } from "~/data/pages/update-page-order";
import { PageBarButton } from "../page-bar-button";
import { useProject } from "../../project-context";
import { usePage } from "../../page-context";
import { Item } from "./item";

export function PagePicker() {
  const { optimisticProjectWithPages, updateProjectWithPages } = useProject();
  const { setActivePage } = usePage();
  const { map } = useMap();
  const { execute: executeCreatePage, status: createPageStatus } = useAction(
    createPage,
    {
      onSuccess: (newPage) => {
        const newPageData = newPage.data;

        if (!newPageData) return;

        setActivePage(newPageData);
      },
    }
  );
  const dragPages = optimisticProjectWithPages.pages;
  const { executeAsync: updatePageOrderAsync } = useAction(updatePageOrder);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const reorderSteps = async (e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      const activeStepIndex = dragPages.findIndex(
        (page) => page.id === e.active.id
      );
      const overStepIndex = dragPages.findIndex(
        (page) => page.id === e.over?.id
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
    <div className="flex gap-4">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={reorderSteps}
        sensors={sensors}
      >
        <SortableContext
          items={dragPages}
          strategy={horizontalListSortingStrategy}
        >
          {dragPages.map((page) => {
            return <Item key={page.id} page={page} />;
          })}
        </SortableContext>
      </DndContext>
      <PageBarButton
        Icon={SquarePlusIcon}
        isDisabled={createPageStatus === "executing"}
        isLoading={createPageStatus === "executing"}
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
      >
        Add Page
      </PageBarButton>
    </div>
  );
}
