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
import { updatePageOrder } from "~/data/pages/update-page-order";
import { useProject } from "../project-context";
import { Item } from "./item";

export function PageList() {
  const { optimisticProjectWithPages, updateProjectWithPages } = useProject();

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
    <div className="flex flex-col mt-4">
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
  );
}
