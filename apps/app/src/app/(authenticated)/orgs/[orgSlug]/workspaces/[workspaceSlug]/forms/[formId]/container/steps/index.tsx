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
import { Badge } from "@mapform/ui/components/badge";
import { useAction } from "next-safe-action/hooks";
import type { DataTrack } from "@mapform/db";
import { createStep } from "~/data/steps/create";
import { updateForm } from "~/data/forms/update";
import { createDataTrack } from "~/data/datatracks/create";
import type { FormWithSteps } from "~/data/forms/get-form-with-steps";
import { Draggable } from "../draggable";
import { useContainerContext } from "../context";
import {
  StepDrawerContent,
  StepDrawerRoot,
  StepDrawerTrigger,
} from "../step-drawer";
import { DatatrackContent, DatatrackDrawerRoot } from "../datatrack-drawer";

export function Steps() {
  const {
    dragSteps,
    setDragSteps,
    formWithSteps,
    viewState,
    currentStep,
    currentDataTrack,
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

  const reorderDataTracks = (e: DragEndEvent) => {
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
    setQueryParamFor("s", newStepId);
  };

  const lastDataTrackStepIndex =
    formWithSteps.dataTracks
      .map((dataTrack) => dataTrack.endStepIndex)
      .sort((a, b) => a - b)
      .pop() || 0;

  const onAddDataTrack = () => {
    execute({
      formId: formWithSteps.id,
      startStepIndex: lastDataTrackStepIndex,
      endStepIndex: lastDataTrackStepIndex + 1,
    });
  };

  const trackSlots = new Array(
    Math.max(dragSteps.length, lastDataTrackStepIndex, 1)
  ).fill(null);

  const currentStepIndex = dragSteps.findIndex(
    (step) => step === currentStep?.id
  );

  return (
    <div className="border-t overflow-x-auto">
      <table className="table-fixed min-w-full">
        <thead>
          <tr>
            {trackSlots.map((_, index) => (
              <th
                className={cn(
                  "pt-4 pb-2 w-32 text-left relative cursor-pointer",
                  currentStepIndex === index
                    ? "text-stone-700"
                    : "text-stone-500",
                  {
                    "before:absolute before:bg-stone-100 before:top-1 before:left-0 before:right-0 before:bottom-0 before:rounded-t-md":
                      currentStepIndex === index,
                  }
                )}
                key={index}
                onClick={() => {
                  setQueryParamFor("s", dragSteps[index]);
                }}
                scope="col"
              >
                <span className="ml-[18px] text-xs font-semibold  relative">
                  <span className="mr-2">Step {index + 1}</span>
                  {currentStepIndex === index ? <Badge>Current</Badge> : null}
                </span>
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
                {dragSteps.map((stepId, index) => {
                  const step = formWithSteps.steps.find((s) => s.id === stepId);

                  if (!step) return null;

                  return (
                    <td
                      className={cn(
                        "whitespace-nowrap p-1.5 text-sm text-stone-700 w-48 min-w-40 relative",
                        {
                          "before:absolute before:bg-stone-100 before:inset-0":
                            currentStepIndex === index,
                        }
                      )}
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
                                "flex relative px-3 rounded-md text-md h-12 text-background w-full bg-violet-400",
                                {
                                  "ring-4 ring-offset-1 ring-violet-800":
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
                              <div className="flex-1 h-full flex justify-center items-center bg-violet-600">
                                <span className="line-clamp-1.5 break-words px-1 text-sm">
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
              <td className="whitespace-nowrap p-1.5 pb-2 text-sm text-stone-700 w-48 min-w-40 relative">
                <button
                  className="w-full h-12 flex justify-center items-center bg-violet-200 rounded-md relative"
                  disabled={status === "pending"}
                  onClick={onAdd}
                >
                  <PlusIcon className="h-6 w-6" />
                </button>
              </td>
            </DndContext>
          </tr>

          {/* DATA */}
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={reorderDataTracks}
            sensors={sensors}
          >
            <DatatrackRow
              formWithSteps={formWithSteps}
              currentStepIndex={currentStepIndex}
              currentDataTrack={currentDataTrack}
              setQueryParamFor={setQueryParamFor}
              onAddDataTrack={onAddDataTrack}
              trackSlots={trackSlots}
              status={status}
            />
          </DndContext>
        </tbody>
      </table>
    </div>
  );
}

function DatatrackRow({
  formWithSteps,
  currentStepIndex,
  currentDataTrack,
  setQueryParamFor,
  onAddDataTrack,
  trackSlots,
  status,
}: {
  formWithSteps: NonNullable<FormWithSteps["data"]>;
  currentStepIndex: number;
  currentDataTrack: DataTrack | undefined;
  setQueryParamFor: (param: "d" | "e" | "s", value?: string) => void;
  onAddDataTrack: () => void;
  trackSlots: unknown[];
  status: string;
}) {
  return (
    <tr>
      <SortableContext
        items={formWithSteps.dataTracks}
        strategy={horizontalListSortingStrategy}
      >
        {formWithSteps.dataTracks.map((dataTrack, index) => {
          return (
            <td
              className={cn(
                "whitespace-nowrap p-1.5 pb-2 text-sm text-stone-700 w-48 min-w-40 relative",
                {
                  "before:absolute before:bg-stone-100 before:top-0 before:left-0 before:right-0 before:bottom-1 before:rounded-b-md":
                    currentStepIndex === index,
                }
              )}
              key={dataTrack.id}
            >
              <DatatrackDrawerRoot
                onOpenChange={(isOpen) => {
                  if (!isOpen && currentDataTrack?.id === dataTrack.id)
                    setQueryParamFor("d");
                }}
                open={currentDataTrack?.id === dataTrack.id}
              >
                <Draggable id={dataTrack.id} key={dataTrack.id}>
                  <button
                    className={cn(
                      "flex relative px-3 rounded-md text-md h-8 w-full text-background bg-blue-400",
                      {
                        "ring-4 ring-offset-1 ring-blue-800":
                          currentDataTrack?.id === dataTrack.id,
                      }
                    )}
                    onClick={() => {
                      if (currentDataTrack?.id === dataTrack.id) {
                        setQueryParamFor("d");
                        return;
                      }
                      setQueryParamFor("d", dataTrack.id);
                    }}
                    type="button"
                  >
                    <div className="flex-1 h-full flex justify-center items-center bg-blue-600">
                      <span className="line-clamp-1.5 break-words px-1 text-sm">
                        {dataTrack.layers.length}{" "}
                        {pluralize("layer", "layers", dataTrack.layers.length)}
                      </span>
                    </div>
                  </button>
                </Draggable>
                <DatatrackContent />
              </DatatrackDrawerRoot>
            </td>
          );
        })}
        {/* Render placeholder slots */}
        {[
          ...Array(trackSlots.length - formWithSteps.dataTracks.length).keys(),
        ].map((index) => (
          <td
            className={cn(
              "whitespace-nowrap p-1.5 pb-2 text-sm text-stone-700 w-48 min-w-40 relative",
              {
                "before:absolute before:bg-stone-100 before:top-0 before:left-0 before:right-0 before:bottom-1 before:rounded-b-md":
                  currentStepIndex === index + formWithSteps.dataTracks.length,
              }
            )}
            key={index}
          >
            <button
              className="w-full h-8 flex justify-center items-center bg-blue-200 rounded-md opacity-0 hover:opacity-100 relative"
              disabled={status === "pending"}
              onClick={onAddDataTrack}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </td>
        ))}
      </SortableContext>
    </tr>
  );
}
