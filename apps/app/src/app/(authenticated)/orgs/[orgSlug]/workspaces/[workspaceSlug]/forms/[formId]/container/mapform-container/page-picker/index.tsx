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
  const pathname = usePathname();
  const { executeAsync: createStepAsync, status: createStepStatus } =
    useAction(createStep);
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
      <DropdownMenuTrigger>
        <Button size="sm">
          <ChevronDown className="h-4 w-4 mr-1" />
          {currentStep?.title ?? `Untitled Page ${currentStepIndex + 1}`}
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
                  <DropdownMenuItem>
                    <DragHandle id={stepId}>
                      <div className="mr-2 flex items-center justify-center flex-shrink-0 cursor-move">
                        <GripVerticalIcon className="h-4 w-4 flex-shrink-0" />
                      </div>
                    </DragHandle>
                    <Link className="flex-1" href={`${pathname}?s=${stepId}`}>
                      <span className="truncate">
                        {step.title ?? `Untitled Page ${index + 1}`}
                      </span>
                    </Link>
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
          onClick={async () => {
            const newStep = await createStepAsync({
              formId: formWithSteps.id,
              location: viewState,
            });

            setQueryParamFor("s", newStep?.data?.id);
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
