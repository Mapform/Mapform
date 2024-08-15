import Link from "next/link";
import {
  ChevronDown,
  Ellipsis,
  GripVerticalIcon,
  PlusIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Button } from "@mapform/ui/components/button";
import { cn } from "@mapform/lib/classnames";
import { usePathname } from "next/navigation";
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
import { DragItem, DragHandle } from "~/components/draggable";
import { useContainerContext } from "../../context";
import { PageItemPopover } from "./page-item-popover";

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
  const { executeAsync } = useAction(createStep);
  const pathname = usePathname();

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

      // await updateFormMutation({
      //   formId: formWithSteps.id,
      //   data: {
      //     stepOrder: newStepList,
      //   },
      // });
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm">
          <ChevronDown className="h-4 w-4 mr-1" />
          {currentStep?.title ?? `Untitled Page ${currentStepIndex + 1}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 overflow-hidden">
        <div className="px-3 py-2 border-b">
          <div className="w-full flex flex-col">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-semibold leading-6 text-stone-400">
                Pages
              </h3>
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
                    const step = formWithSteps.steps.find(
                      (s) => s.id === stepId
                    );

                    if (!step) return null;

                    return (
                      <DragItem id={stepId} key={stepId}>
                        <div
                          className={cn(
                            "flex items-center justify-between hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded",
                            {
                              "bg-stone-100": stepId === currentStep?.id,
                            }
                          )}
                        >
                          <div className="flex items-center flex-1 gap-2 overflow-hidden">
                            <DragHandle id={stepId}>
                              <div className="h-4 w-4 flex items-center justify-center flex-shrink-0 cursor-move">
                                <GripVerticalIcon className="h-4 w-4 flex-shrink-0" />
                              </div>
                            </DragHandle>
                            <Link
                              className="flex-1"
                              href={`${pathname}?s=${stepId}`}
                            >
                              <span className="truncate">
                                {step.title ?? `Untitled Page ${index + 1}`}
                              </span>
                            </Link>
                            <PageItemPopover />
                          </div>
                        </div>
                      </DragItem>
                    );
                  })}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
        <div className="px-3 py-2 bg-stone-50">
          <div className="w-full flex flex-col">
            <button
              className="appearance-none flex gap-2 items-center text-left hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
              onClick={async () => {
                const newStep = await executeAsync({
                  formId: formWithSteps.id,
                  location: viewState,
                });

                setQueryParamFor("s", newStep?.data?.id);
              }}
              type="button"
            >
              <div className="h-4 w-4 flex items-center justify-center">
                <PlusIcon className="h-4 w-4 flex-shrink-0" />
              </div>
              Create new page
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
