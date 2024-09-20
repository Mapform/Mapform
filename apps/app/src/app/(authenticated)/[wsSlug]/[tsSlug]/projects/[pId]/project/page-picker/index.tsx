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
import { createStep } from "~/data/steps/create";
import { updateForm } from "~/data/forms/update";
import { DragItem, DragHandle } from "~/components/draggable";
import { PageBarButton } from "../page-bar-button";
import { useProjectContext } from "../../context";

export function PagePicker() {
  const {
    map,
    dragPages,
    currentPage,
    setDragPages,
    projectWithPages,
    setQueryParamFor,
  } = useProjectContext();
  const { execute: executeCreateStep, status: createStepStatus } = useAction(
    createStep,
    {
      onSuccess: (newPage) => {
        const newPageData = newPage.data;

        if (!newPageData) return;

        setDragPages((prev) => [...prev, newPageData.id]);
        setQueryParamFor("p", newPageData);
      },
    }
  );
  const { executeAsync: updateFormAsync } = useAction(updateForm);

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
        (step) => step === e.active.id
      );
      const overStepIndex = dragPages.findIndex((step) => step === e.over?.id);

      if (activeStepIndex < 0 || overStepIndex < 0) return;

      const newPageList = arrayMove(dragPages, activeStepIndex, overStepIndex);
      setDragPages(newPageList);

      // await updateFormAsync({
      //   formId: projectWithPages.id,
      //   data: {
      //     stepOrder: newPageList,
      //   },
      // });
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
          {dragPages.map((pageId) => {
            const step = projectWithPages.pages.find((p) => p.id === pageId);

            if (!step) return null;

            return (
              <DragItem id={pageId} key={pageId}>
                <DragHandle id={pageId}>
                  <PageBarButton
                    Icon={PanelLeftIcon}
                    isActive={pageId === currentPage?.id}
                    isSubtle
                    onClick={() => {
                      setQueryParamFor("p", step);
                    }}
                  >
                    {step.title || "Untitled"}
                  </PageBarButton>
                </DragHandle>
              </DragItem>
            );
          })}
        </SortableContext>
      </DndContext>
      <PageBarButton
        Icon={SquarePlusIcon}
        isDisabled={createStepStatus === "executing"}
        isLoading={createStepStatus === "executing"}
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

          executeCreateStep({
            formId: projectWithPages.id,
            location: {
              latitude: loc.lat,
              longitude: loc.lng,
              zoom,
              pitch,
              bearing,
            },
          });
        }}
      >
        Add Page
      </PageBarButton>
    </div>
  );
}
