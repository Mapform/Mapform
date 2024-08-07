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
import { pluralize } from "@mapform/lib/pluralize";
import { useAction } from "next-safe-action/hooks";
import { createStep } from "~/data/steps/create";
import { updateForm } from "~/data/forms/update";
import { createDataTrack } from "~/data/datatracks/create";
import { Draggable } from "../draggable";
import { useContainerContext } from "../context";
import { Badge } from "@mapform/ui/components/badge";

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

    const newStepId = newStep?.data?.id;

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

  const currentStepIndex = dragSteps.findIndex(
    (step) => step === currentStep?.id
  );

  return (
    <div className="border-t bg-white overflow-x-auto">
      <table className="table-fixed min-w-full overflow-hidden">
        <thead>
          <tr>
            <th
              className="p-1.5 text-left text-sm font-semibold text-stone-900 w-32"
              scope="col"
            />
            {trackSlots.map((_, index) => (
              <th
                className="h-12 pl-1.5 pb-0 w-32 text-left relative"
                key={index}
                scope="col"
              >
                {/* {currentStepIndex === index ? (
                  <div className="absolute bg-primary w-[2px] h-[200px] z-10 -left-[1px] top-0" />
                ) : null} */}
                <span className="text-xs font-semibold text-stone-400">
                  <span className="mr-2">• Step {index + 1}</span>
                  {currentStepIndex === index ? (
                    <Badge variant="secondary">Current</Badge>
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {/* STEPS */}
          <tr>
            <td className="flex justify-between whitespace-nowrap px-4 text-sm font-medium text-stone-900 w-32">
              <div className="text-xs font-semibold leading-6 text-stone-400 mb-0">
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
                    <PlusIcon className="h-4 w-4 text-stone-400" />
                  )}
                </Button>
              </span>
            </td>
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
                      className="whitespace-nowrap p-1.5 text-sm text-stone-700 w-48"
                      key={stepId}
                    >
                      <Draggable id={stepId}>
                        <button
                          className={cn(
                            "flex relative px-3 rounded-md text-md h-12 w-full bg-orange-200",
                            {
                              "ring-4 ring-orange-500":
                                currentStep?.id === stepId,
                            }
                          )}
                          onClick={() => {
                            setCurrentStep(step.id);
                          }}
                          type="button"
                        >
                          <div className="flex-1 h-full flex justify-center items-center bg-orange-300">
                            <span className="line-clamp-1.5 break-words px-1 text-sm">
                              {step.title || "Untitled"}
                            </span>
                          </div>
                        </button>
                      </Draggable>
                    </td>
                  );
                })}
              </SortableContext>
            </DndContext>
          </tr>

          {/* DATA */}
          <tr>
            <td className="flex justify-between whitespace-nowrap px-4 text-sm font-medium text-stone-900 w-32">
              <div className="text-xs font-semibold leading-6 text-stone-400 mb-0">
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
                    <PlusIcon className="h-4 w-4 text-stone-400" />
                  )}
                </Button>
              </span>
            </td>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={reorderDataTracks}
              sensors={sensors}
            >
              <SortableContext
                items={formWithSteps.dataTracks}
                strategy={horizontalListSortingStrategy}
              >
                {formWithSteps.dataTracks.map((dataTrack) => {
                  return (
                    <td
                      className="whitespace-nowrap p-1.5 text-sm text-stone-700 w-48"
                      key={dataTrack.id}
                    >
                      <Draggable id={dataTrack.id} key={dataTrack.id}>
                        <button
                          className={cn(
                            "flex relative px-3 rounded-md text-md h-12 w-full bg-blue-200",
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
                            <span className="line-clamp-1.5 break-words px-1 text-sm">
                              {dataTrack.layers.length}{" "}
                              {pluralize(
                                "layer",
                                "layers",
                                dataTrack.layers.length
                              )}
                            </span>
                          </div>
                        </button>
                      </Draggable>
                    </td>
                  );
                })}
              </SortableContext>
            </DndContext>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
