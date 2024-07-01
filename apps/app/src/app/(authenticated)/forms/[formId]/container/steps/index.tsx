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
import { PlusIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { createStep } from "~/server/actions/steps/create";
import { updateForm } from "~/server/actions/forms/update";
import { createDataTrack } from "~/server/actions/datatracks/create";
import { Draggable } from "../draggable";
import { useContainerContext } from "../context";
import { set } from "date-fns";

export function Steps() {
  const {
    dragSteps,
    setDragSteps,
    setCurrentStep,
    formWithSteps,
    viewState,
    currentStep,
    currentDataTrack,
    setCurrentDataTrack,
  } = useContainerContext();
  // TODO: Get rid of react-query?
  const { mutateAsync: updateFormMutation } = useMutation({
    mutationFn: updateForm,
  });
  const { mutateAsync: createStepMutation, status } = useMutation({
    mutationFn: createStep,
  });
  const { execute, status: createTrackStatus } = useAction(createDataTrack);

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

  const reorderDataTracks = async (e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      const activeDataTrackIndex = formWithSteps.dataTracks.findIndex(
        (track) => track.id === e.active.id
      );
      const overDataTrackIndex = formWithSteps.dataTracks.findIndex(
        (track) => track.id === e.over?.id
      );

      if (activeDataTrackIndex < 0 || overDataTrackIndex < 0) return;

      console.log(111111, activeDataTrackIndex, overDataTrackIndex);

      // const newStepList = arrayMove(
      //   formWithSteps.dataTracks,
      //   activeStepIndex,
      //   overStepIndex
      // );

      // await updateFormMutation({
      //   formId: formWithSteps.id,
      //   data: {
      //     dataTracks: newStepList,
      //   },
      // });
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

  const lastDataTrackStepIndex =
    formWithSteps.dataTracks
      .map((dataTrack) => dataTrack.endStepIndex)
      .sort((a, b) => a - b)
      .pop() || 0;

  const onAddDataTrack = () => {
    execute({
      data: {
        formId: formWithSteps.id,
        startStepIndex: lastDataTrackStepIndex,
        endStepIndex: lastDataTrackStepIndex + 1,
      },
    });
  };

  const trackSlots = new Array(
    Math.max(dragSteps.length, lastDataTrackStepIndex, 1)
  ).fill(null);

  return (
    <div className="border-t bg-white overflow-x-auto">
      {/* STEP INDICATORS */}
      <div className="flex">
        <div className="w-36 border-r" />
        <div className="px-4 pt-2">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${trackSlots.length}, 150px)`,
            }}
          >
            {trackSlots.map((_, index) => (
              <div className="text-xs text-gray-500" key={index}>
                {index + 1}
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
        <div className="flex">
          <div className="flex justify-between gap-y-2 w-36 px-4 pb-4 pt-2 border-r">
            <div className="text-xs font-semibold leading-6 text-gray-400 mb-0">
              Steps
            </div>
            <span>
              <Button
                className="-mr-1.5"
                disabled={status === "pending"}
                onClick={onAdd}
                size="icon"
                variant="ghost"
              >
                {status === "pending" ? (
                  <Spinner variant="dark" />
                ) : (
                  <PlusIcon className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </span>
          </div>
          <div
            className="grid gap-2 px-4 pb-4 pt-2"
            style={{
              gridTemplateColumns: `repeat(${trackSlots.length}, 150px)`,
            }}
          >
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
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={reorderDataTracks}
        sensors={sensors}
      >
        <div className="flex">
          <div className="flex justify-between gap-y-2 w-36 px-4 pb-4 border-r">
            <div className="text-xs font-semibold leading-6 text-gray-400 mb-0">
              Data
            </div>
            <span>
              <Button
                className="-mr-1.5"
                disabled={status === "pending"}
                onClick={onAddDataTrack}
                size="icon"
                variant="ghost"
              >
                {status === "pending" ? (
                  <Spinner variant="dark" />
                ) : (
                  <PlusIcon className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </span>
          </div>
          <div
            className="grid gap-2 px-4 pb-4"
            style={{
              gridTemplateColumns: `repeat(${trackSlots.length}, 150px)`,
            }}
          >
            <SortableContext
              items={formWithSteps.dataTracks}
              strategy={horizontalListSortingStrategy}
            >
              {formWithSteps.dataTracks.map((dataTrack) => {
                return (
                  <Draggable id={dataTrack.id} key={dataTrack.id}>
                    <button
                      className={cn(
                        "flex relative px-3 rounded-md text-md h-16 w-full bg-blue-200",
                        {
                          "ring-4 ring-blue-500":
                            currentDataTrack?.id === dataTrack.id,
                        }
                      )}
                      onClick={() => {
                        if (currentDataTrack?.id === dataTrack.id) {
                          setCurrentDataTrack();
                          return;
                        }
                        setCurrentDataTrack(dataTrack.id);
                      }}
                      type="button"
                    >
                      <div className="flex-1 h-full flex justify-center items-center bg-blue-300">
                        <span className="line-clamp-2 break-words px-1">
                          {dataTrack.id}
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
    </div>
  );
}
