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
import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import { Spinner } from "@mapform/ui/components/spinner";
import { useMutation } from "@tanstack/react-query";
import { createStep } from "~/server/actions/steps/create";
import { updateForm } from "~/server/actions/forms/update";
import { Draggable } from "../draggable";
import { useContainerContext } from "../context";
import { PlusIcon } from "lucide-react";

export function Steps() {
  const {
    dragSteps,
    setDragSteps,
    setCurrentStep,
    formWithSteps,
    viewState,
    currentStep,
  } = useContainerContext();
  const { mutateAsync: updateFormMutation } = useMutation({
    mutationFn: updateForm,
  });
  const { mutateAsync: createStepMutation, status } = useMutation({
    mutationFn: createStep,
  });

  /**
   * Needed to support click events on DND items
   */
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

      await updateFormMutation({
        formId: formWithSteps.id,
        data: {
          stepOrder: newStepList,
        },
      });
    }
  };

  const onAdd = async () => {
    const newStep = await createStepMutation({
      formId: formWithSteps.id,
      location: viewState,
    });

    const newStepId = newStep.data?.id;

    if (!newStepId || !newStep.data) return;

    setDragSteps((prev) => [...prev, newStepId]);
    setCurrentStep(newStepId);
  };

  return (
    <div className="border-t bg-white">
      {/* STEP INDICATORS */}
      <div className="flex overflow-x-auto">
        <div className="w-32 border-r" />
        <div className="px-4 pt-2">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${dragSteps.length}, 150px)`,
            }}
          >
            {dragSteps.map((stepId) => (
              <div className="text-xs text-gray-500" key={stepId}>
                {dragSteps.indexOf(stepId) + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEPS */}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={reorderSteps}
        sensors={sensors}
      >
        <div className="flex overflow-x-auto">
          <div className="flex justify-between gap-y-2 w-32 px-4 pb-4 pt-2 border-r">
            <div className="text-xs font-semibold leading-6 text-gray-400 mb-0">
              Steps
            </div>
            <Button
              disabled={status === "pending"}
              onClick={onAdd}
              size="icon"
              variant="ghost"
            >
              {status === "pending" ? (
                <Spinner variant="dark" />
              ) : (
                <PlusIcon
                  className="text-gray-400 self-start"
                  height={18}
                  width={18}
                />
              )}
            </Button>
          </div>
          <div
            className="grid gap-2 px-4 pb-4 pt-2"
            style={{
              gridTemplateColumns: `repeat(${dragSteps.length}, 150px)`,
            }}
          >
            {/* STEPS */}
            <SortableContext
              items={dragSteps}
              strategy={horizontalListSortingStrategy}
            >
              {dragSteps.map((stepId) => {
                const step = formWithSteps.steps.find((s) => s.id === stepId);

                if (!step) return null;

                return (
                  <Draggable id={stepId} key={stepId}>
                    <button
                      className={cn(
                        "flex relative px-3 rounded-md text-md h-16 w-full bg-orange-200",
                        {
                          "ring-4 ring-orange-500": currentStep?.id === stepId,
                        }
                      )}
                      onClick={() => {
                        setCurrentStep(step.id);
                      }}
                      type="button"
                    >
                      <div className="flex-1 h-full flex justify-center items-center bg-orange-300">
                        <span className="line-clamp-2 break-words px-1">
                          {step.title || "Untitled"}
                        </span>
                      </div>
                    </button>
                  </Draggable>
                );
              })}
            </SortableContext>
          </div>
        </div>
      </DndContext>

      {/* DATA TRACKS */}
    </div>
  );
}
