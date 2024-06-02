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
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import type { MapRef, ViewState } from "@mapform/mapform";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type StepWithLocation } from "@mapform/db/extentsions/steps";
import { type StepsType } from "~/server/actions/forms/get-form-with-steps/schema";
import { createStep } from "~/server/actions/steps/create";
import { updateForm } from "~/server/actions/forms/update";
import { useCreateQueryString } from "~/lib/create-query-string";
import { type UpdateFormSchema } from "~/server/actions/forms/update/schema";
import { type getFormWithSteps } from "~/server/actions/forms/get-form-with-steps";
import { Draggable } from "../draggable";

type FormWithSteps = NonNullable<
  Awaited<ReturnType<typeof getFormWithSteps>>["data"]
>;

interface StepsProps {
  map: React.RefObject<MapRef>;
  formId: string;
  viewState: ViewState;
  currentStep: StepWithLocation | undefined;
  dragSteps: StepsType;
  setDragSteps: React.Dispatch<React.SetStateAction<StepsType>>;
}

export function Steps({
  map,
  formId,
  viewState,
  dragSteps,
  setDragSteps,
  currentStep,
}: StepsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const createQueryString = useCreateQueryString();
  const { mutateAsync } = useMutation({
    mutationFn: updateForm,
    onMutate: async (args: UpdateFormSchema) => {
      await queryClient.cancelQueries({
        queryKey: ["forms", formId],
      });

      // Snapshot the previous value
      const previousForm = queryClient.getQueryData([
        "forms",
        formId,
      ]) as FormWithSteps | null;

      if (!previousForm) {
        return;
      }

      const stepOrder = args.data.stepOrder ?? [];

      const newForm = {
        ...previousForm,
        stepOrder,
        steps: [...previousForm.steps].sort(
          (a, b) => stepOrder.indexOf(a.id) - stepOrder.indexOf(b.id)
        ),
      };

      // Optimistically update to the new value
      queryClient.setQueryData(["forms", formId], newForm);

      // Return a context with the previous and new todo
      return { previousForm, newForm };
    },
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

  const createStepWithFromId = createStep.bind(null, {
    formId,
    location: viewState,
  });

  const reorderSteps = async (e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      const activeStepIndex = dragSteps.findIndex(
        (step) => step.id === e.active.id
      );
      const overStepIndex = dragSteps.findIndex(
        (step) => step.id === e.over?.id
      );

      if (activeStepIndex < 0 || overStepIndex < 0) return;

      const newStepList = arrayMove(dragSteps, activeStepIndex, overStepIndex);
      setDragSteps(newStepList);

      await mutateAsync({
        formId,
        data: {
          stepOrder: newStepList.map((step) => step.id),
        },
      });
    }
  };

  const setCurrentStep = (step: StepsType[number]) => {
    map.current?.flyTo({
      center: [step.longitude, step.latitude],
      zoom: step.zoom,
      pitch: step.pitch,
      bearing: step.bearing,
      duration: 1000,
    });
    router.push(`${pathname}?${createQueryString("s", step.id)}`);
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
            <form action={createStepWithFromId}>
              <Button size="icon" variant="secondary">
                +
              </Button>
            </form>
          </div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${dragSteps.length}, 150px)`,
            }}
          >
            {/* STEP NUMBERS */}
            {dragSteps.map((step) => (
              <div className="text-sm text-gray-500" key={step.id}>
                {dragSteps.indexOf(step) + 1}
              </div>
            ))}

            {/* STEPS */}
            <SortableContext
              items={dragSteps}
              strategy={horizontalListSortingStrategy}
            >
              {dragSteps.map((step) => (
                <Draggable id={step.id} key={step.id}>
                  <button
                    className={cn(
                      "flex relative px-3 rounded-md text-md h-16 w-full bg-orange-200",
                      {
                        "ring-4 ring-orange-500": currentStep?.id === step.id,
                      }
                    )}
                    onClick={() => {
                      setCurrentStep(step);
                    }}
                    type="button"
                  >
                    <div className="flex-1 h-full flex justify-center items-center bg-orange-300">
                      {step.title ?? "Untitled"}
                    </div>
                  </button>
                </Draggable>
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
