"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import type { MapRef, ViewState } from "@mapform/mapform";
import { MapForm } from "@mapform/mapform";
import { Button } from "@mapform/ui/components/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@mapform/lib/use-debounce";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type z } from "zod";
import type { FormUpdateArgsSchema } from "@mapform/db/prisma/zod";
import { Spinner } from "@mapform/ui/components/spinner";
import { cn } from "@mapform/lib/classnames";
import { env } from "~/env.mjs";
import {
  createStep,
  updateStep,
  updateForm,
  getFormWithSteps,
} from "../actions";
import { type StepsType } from "../actions";
import { Draggable } from "./draggable";
// TODO. Temporary. Should get initial view state from previous step, or from user location
const initialViewState = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 14,
  bearing: 0,
  pitch: 0,
  padding: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
};

type FormWithSteps = NonNullable<Awaited<ReturnType<typeof getFormWithSteps>>>;

export function Container({
  formSlug,
  orgSlug,
  workspaceSlug,
}: {
  formSlug: string;
  orgSlug: string;
  workspaceSlug: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const s = searchParams.get("s");
  const queryClient = useQueryClient();
  const [mapformLoaded, setMapformLoaded] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(initialViewState);
  const map = useRef<MapRef>(null);
  // We hold the steps in its own React state due to this issue: https://github.com/clauderic/dnd-kit/issues/921
  const [dragSteps, setDragSteps] = useState<FormWithSteps["steps"]>([]);
  const { data, error, isLoading } = useQuery({
    queryKey: ["forms", formSlug, workspaceSlug, orgSlug],
    queryFn: async () => {
      const formWithSteps = await getFormWithSteps(
        formSlug,
        workspaceSlug,
        orgSlug
      );

      if (formWithSteps) {
        setDragSteps(formWithSteps.steps);
      }
      return formWithSteps;
    },
  });
  const { mutateAsync } = useMutation({
    mutationFn: updateForm,
    onMutate: async (args: z.infer<typeof FormUpdateArgsSchema>) => {
      await queryClient.cancelQueries({
        queryKey: ["forms", formSlug, workspaceSlug, orgSlug],
      });

      // Snapshot the previous value
      const previousForm = queryClient.getQueryData([
        "forms",
        formSlug,
        workspaceSlug,
        orgSlug,
      ]) as FormWithSteps | null;

      if (!previousForm) {
        return;
      }

      const newForm = {
        ...previousForm,
        stepOrder: args.data.stepOrder,
        steps: [...previousForm.steps].sort(
          (a, b) =>
            (args.data.stepOrder as string[]).indexOf(a.id) -
            (args.data.stepOrder as string[]).indexOf(b.id)
        ),
      };

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["forms", formSlug, workspaceSlug, orgSlug],
        newForm
      );

      // Return a context with the previous and new todo
      return { previousForm, newForm };
    },
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

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

  useEffect(() => {
    if (data?.steps[0] && !s) {
      router.push(`${pathname}?${createQueryString("s", data.steps[0].id)}`);
    }
  }, [s, data?.steps, pathname, router, createQueryString]);

  const debouncedUpdateStep = useDebounce(updateStep, 500);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  if (!s) {
    return null;
  }

  const createStepWithFromId = createStep.bind(null, data.id, viewState);
  const currentStep = dragSteps.find((step) => step.id === s);

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
        where: {
          id: data.id,
        },
        data: {
          stepOrder: newStepList.map((step) => step.id),
        },
      });
    }
  };

  return (
    <div className="relative flex flex-col flex-1 bg-slate-100 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      {mapformLoaded ? null : (
        <div className="absolute inset-0 flex justify-center items-center">
          <Spinner variant="dark" />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col flex-1  transition-all duration-300 ease-in-out",
          {
            invisible: !mapformLoaded,
            opacity: mapformLoaded ? 1 : 0,
          }
        )}
      >
        {/* MAP */}
        <div className="p-8 flex-1 flex justify-center">
          <div className="shadow max-w-screen-lg flex-1 rounded-md overflow-hidden">
            <MapForm
              currentStep={currentStep}
              editable
              mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              onDescriptionChange={async (content: { content: any[] }) => {
                await debouncedUpdateStep({
                  where: {
                    id: s,
                  },
                  data: {
                    description: content,
                  },
                });
              }}
              onLoad={() => {
                setMapformLoaded(true);
              }}
              onTitleChange={async (content: string) => {
                await debouncedUpdateStep({
                  where: {
                    id: s,
                  },
                  data: {
                    title: content,
                  },
                });
              }}
              ref={map}
              setViewState={(evt) => {
                setViewState(evt.viewState);
              }}
              viewState={viewState}
            />
          </div>
        </div>

        {/* STEPS */}
        <div className="border-t bg-white">
          <form action={createStepWithFromId} className="p-4">
            <Button>New step</Button>
          </form>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={reorderSteps}
            sensors={sensors}
          >
            <div className="flex gap-2 overflow-x-auto pb-4">
              <SortableContext
                items={dragSteps}
                strategy={horizontalListSortingStrategy}
              >
                {dragSteps.map((step) => (
                  <Draggable id={step.id} key={step.id}>
                    <button
                      className={cn(
                        "bg-gray-200 px-4 rounded-md min-w-24 h-3",
                        {
                          "bg-gray-400": currentStep?.id === step.id,
                        }
                      )}
                      onClick={() => {
                        setCurrentStep(step);
                      }}
                      type="button"
                    >
                      {/* {step.id} */}
                    </button>
                  </Draggable>
                ))}
              </SortableContext>
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
