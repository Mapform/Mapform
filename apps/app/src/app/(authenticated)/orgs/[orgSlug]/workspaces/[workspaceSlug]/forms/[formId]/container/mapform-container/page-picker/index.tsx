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
import { useContainerContext } from "../../context";
import { PageItemSubmenu } from "./page-item-submenu";
import { cn } from "@mapform/lib/classnames";

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
                  <button
                    className={cn(
                      "flex-1 truncate text-center group hover:text-primary",
                      {
                        "text-muted-foreground": stepId !== currentStep?.id,
                        "font-medium": stepId === currentStep?.id,
                      }
                    )}
                    onClick={() => {
                      setQueryParamFor("s", step);
                    }}
                    type="button"
                  >
                    <PanelLeftIcon className="h-6 w-6 flex-shrink-0 mx-auto" />
                    <span
                      className={cn(
                        "truncate text-xs px-1.5 py-0.5 rounded-md group-hover:bg-muted transition",
                        {
                          "!bg-primary text-white": stepId === currentStep?.id,
                        }
                      )}
                    >
                      {step.title || "Untitled"}
                    </span>
                  </button>
                </DragHandle>
              </DragItem>
            );
          })}
        </SortableContext>
      </DndContext>
      <button
        className="flex-1 truncate text-center"
        disabled={createStepStatus === "executing"}
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
        type="button"
      >
        {createStepStatus === "executing" ? (
          <div className="flex h-6 w-6 justify-center items-center mx-auto">
            <Spinner variant="dark" />
          </div>
        ) : (
          <SquarePlusIcon className="h-6 w-6 flex-shrink-0 mx-auto" />
        )}
        <span className="truncate text-xs font-medium">Add Page</span>
      </button>
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="max-w-40" size="sm">
          <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">
            {currentStep?.title || "Untitled Page"}
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
            {dragSteps.map((stepId) => {
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
                        {step.title || "Untitled Page"}
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
