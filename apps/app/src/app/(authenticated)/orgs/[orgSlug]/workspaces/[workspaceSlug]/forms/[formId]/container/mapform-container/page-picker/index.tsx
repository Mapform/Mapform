import { ChevronDown, GripVerticalIcon, PlusIcon } from "lucide-react";
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
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createStep } from "~/data/steps/create";
import { updateForm } from "~/data/forms/update";
import { DragItem, DragHandle } from "~/components/draggable";
import { useContainerContext } from "../../context";
import { PageItemSubmenu } from "./page-item-submenu";

export function PagePicker() {
  const {
    dragSteps,
    viewState,
    currentStep,
    setDragSteps,
    formWithSteps,
    currentStepIndex,
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="max-w-40" size="sm">
          <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">
            {currentStep?.title ?? "Untitled Page"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuLabel>Pages</DropdownMenuLabel>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={reorderSteps}
          sensors={sensors}
        >
          <SortableContext
            items={dragSteps}
            strategy={verticalListSortingStrategy}
          >
            {dragSteps.map((stepId, index) => {
              const step = formWithSteps.steps.find((s) => s.id === stepId);

              if (!step) return null;

              return (
                <DragItem id={stepId} key={stepId}>
                  <DropdownMenuItem highlight={stepId === currentStep?.id}>
                    <DragHandle id={stepId}>
                      <div className="mr-2 flex items-center justify-center flex-shrink-0 cursor-move">
                        <GripVerticalIcon className="h-4 w-4 flex-shrink-0" />
                      </div>
                    </DragHandle>
                    <button
                      className="flex-1 truncate text-left"
                      onClick={() => {
                        setQueryParamFor("s", step);
                      }}
                      type="button"
                    >
                      <span className="truncate">
                        {step.title ?? "Untitled Page"}
                      </span>
                    </button>
                    <PageItemSubmenu pageId={stepId} />
                  </DropdownMenuItem>
                </DragItem>
              );
            })}
          </SortableContext>
        </DndContext>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="font-medium cursor-pointer"
          disabled={createStepStatus === "executing"}
          onClick={() => {
            executeCreateStep({
              formId: formWithSteps.id,
              location: viewState,
            });
          }}
        >
          <div className="h-4 w-4 flex items-center justify-center mr-2">
            {createStepStatus === "executing" ? (
              <Spinner size="xs" variant="dark" />
            ) : (
              <PlusIcon className="h-4 w-4 flex-shrink-0" />
            )}
          </div>
          Create new page
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
