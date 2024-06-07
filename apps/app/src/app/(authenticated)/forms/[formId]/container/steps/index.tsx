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
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={reorderSteps}
        sensors={sensors}
      >
        <div className="flex gap-16 overflow-x-auto p-4">
          <div className="flex flex-col gap-y-2">
            <div className="text-sm font-semibold">STEPS</div>
            <Button
              disabled={status === "pending"}
              onClick={onAdd}
              size="icon"
              variant="secondary"
            >
              {status === "pending" ? <Spinner variant="dark" /> : "+"}
            </Button>
          </div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${dragSteps.length}, 150px)`,
            }}
          >
            {/* STEP NUMBERS */}
            {dragSteps.map((stepId) => (
              <div className="text-sm text-gray-500" key={stepId}>
                {dragSteps.indexOf(stepId) + 1}
              </div>
            ))}

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
                        {step.title || "Untitled"}
                      </div>
                    </button>
                  </Draggable>
                );
              })}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  );
}