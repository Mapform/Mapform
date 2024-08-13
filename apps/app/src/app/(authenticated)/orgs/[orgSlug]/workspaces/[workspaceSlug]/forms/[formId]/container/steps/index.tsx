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
import { PlusIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@mapform/ui/components/badge";
import { useAction } from "next-safe-action/hooks";
import { createStep } from "~/data/steps/create";
import { updateForm } from "~/data/forms/update";
import { createDataTrack } from "~/data/datatracks/create-datatrack";
import { Draggable } from "../draggable";
import { useContainerContext } from "../context";
import {
  StepDrawerContent,
  StepDrawerRoot,
  StepDrawerTrigger,
} from "../step-drawer";
import { DataTracks } from "./datatracks";

export function Steps() {
  const {
    dragSteps,
    setDragSteps,
    formWithSteps,
    viewState,
    currentStep,
    setQueryParamFor,
    currentEditableStep,
  } = useContainerContext();
  // TODO: Get rid of react-query?
  const { mutateAsync: updateFormMutation } = useMutation({
    mutationFn: updateForm,
  });
  const { mutateAsync: createStepMutation, status } = useMutation({
    mutationFn: createStep,
  });
  const { execute } = useAction(createDataTrack);

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

    const newStepId = newStep?.data?.id;

    if (!newStepId || !newStep.data) return;

    setDragSteps((prev) => [...prev, newStepId]);
    setQueryParamFor("s", newStepId);
  };

  const onAddDataTrack = (
    startStepIndex: number,
    endStepIndex: number,
    layerIndex: number
  ) => {
    execute({
      formId: formWithSteps.id,
      startStepIndex,
      endStepIndex,
      layerIndex,
    });
  };

  const currentStepIndex = dragSteps.findIndex(
    (step) => step === currentStep?.id
  );

  return (
    <div className="border-t overflow-x-auto px-3 pb-2">
      <table className="table-fixed min-w-full">
        <thead>
          <tr>
            {dragSteps.map((_, index) => (
              <th
                className="whitespace-nowrap p-1 text-sm text-stone-700 w-48 min-w-40"
                key={index}
                onClick={() => {
                  setQueryParamFor("s", dragSteps[index]);
                }}
                scope="col"
              >
                <button className="hover:bg-stone-100 rounded-md w-full text-left py-2 flex items-center">
                  <span className="ml-[18px] text-xs font-semibold">
                    <span className="mr-2">Step {index + 1}</span>
                    {currentStepIndex === index ? <Badge>Current</Badge> : null}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {/* STEPS */}
          <tr>
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
                    <td
                      className="whitespace-nowrap p-1 text-sm text-stone-700 w-48 min-w-40"
                      key={stepId}
                    >
                      <StepDrawerRoot
                        key={stepId}
                        onOpenChange={(isOpen) => {
                          if (!isOpen && currentEditableStep?.id === stepId)
                            setQueryParamFor("e");
                        }}
                        open={currentEditableStep?.id === stepId}
                      >
                        <Draggable id={stepId}>
                          <StepDrawerTrigger asChild>
                            <button
                              className={cn(
                                "flex relative px-3 rounded-md text-md h-12 text-background w-full bg-orange-200",
                                {
                                  "ring-2 ring-offset-2 ring-orange-600":
                                    currentEditableStep?.id === stepId,
                                }
                              )}
                              onClick={() => {
                                if (currentEditableStep?.id === step.id) {
                                  setQueryParamFor("e");
                                  return;
                                }
                                setQueryParamFor("e", stepId);
                              }}
                              type="button"
                            >
                              <div className="flex-1 h-full flex justify-center items-center bg-orange-400">
                                <span className="line-clamp-1 break-words px-1 text-sm">
                                  {step.title || "Untitled"}
                                </span>
                              </div>
                            </button>
                          </StepDrawerTrigger>
                        </Draggable>
                        <StepDrawerContent />
                      </StepDrawerRoot>
                    </td>
                  );
                })}
              </SortableContext>
              <td className="whitespace-nowrap p-1 text-sm text-stone-700 w-48 min-w-40">
                <button
                  className="w-full h-12 flex justify-center items-center bg-orange-200 rounded-md"
                  disabled={status === "pending"}
                  onClick={onAdd}
                >
                  <PlusIcon className="text-orange-950 h-5 w-5" />
                </button>
              </td>
            </DndContext>
          </tr>

          <DataTracks />
        </tbody>
      </table>
    </div>
  );
}
