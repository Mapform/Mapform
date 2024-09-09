import {
  ChevronDown,
  GripVerticalIcon,
  PanelLeftIcon,
  PlusIcon,
  SquarePlusIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { Button } from "@mapform/ui/components/button";
import { Spinner } from "@mapform/ui/components/spinner";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createStep } from "~/data/steps/create";
import { updateForm } from "~/data/forms/update";
import { DragItem, DragHandle } from "~/components/draggable";
import { PageBarButton } from "../page-bar-button";
import { useContainerContext } from "../../context";
import { PageItemSubmenu } from "./page-item-submenu";

export function PagePicker() {
  const {
    map,
    dragSteps,
    currentStep,
    setDragSteps,
    formWithSteps,
    setQueryParamFor,
  } = useContainerContext();
  const { execute: executeCreateStep, status: createStepStatus } = useAction(
    createStep,
    {
      onSuccess: (newStep) => {
        const newStepData = newStep.data;

        if (!newStepData) return;

        setDragSteps((prev) => [...prev, newStepData.id]);
        setQueryParamFor("s", newStepData);
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
      const activeStepIndex = dragSteps.findIndex(
        (step) => step === e.active.id
      );
      const overStepIndex = dragSteps.findIndex((step) => step === e.over?.id);

      if (activeStepIndex < 0 || overStepIndex < 0) return;

      const newStepList = arrayMove(dragSteps, activeStepIndex, overStepIndex);
      setDragSteps(newStepList);

      await updateFormAsync({
        formId: formWithSteps.id,
        data: {
          stepOrder: newStepList,
        },
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
          items={dragSteps}
          strategy={horizontalListSortingStrategy}
        >
          {dragSteps.map((stepId) => {
            const step = formWithSteps.steps.find((s) => s.id === stepId);

            if (!step) return null;

            return (
              <DragItem id={stepId} key={stepId}>
                <DragHandle id={stepId}>
                  <PageBarButton
                    Icon={PanelLeftIcon}
                    isActive={stepId === currentStep?.id}
                    isSubtle
                    onClick={() => {
                      setQueryParamFor("s", step);
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
            formId: formWithSteps.id,
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
