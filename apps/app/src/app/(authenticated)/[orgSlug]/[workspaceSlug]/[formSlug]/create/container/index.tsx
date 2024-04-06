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
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import type { FormUpdateArgsSchema } from "@mapform/db/prisma/zod";
import { env } from "~/env.mjs";
import {
  createStep,
  updateStep,
  updateForm,
  getFormWithSteps,
} from "../actions";
import { type StepsType } from "../actions";
import { Draggable } from "./draggable";
import { Sidebar } from "./sidebar";
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
  const [viewState, setViewState] = useState<ViewState>(initialViewState);
  const map = useRef<MapRef>(null);
  const { data, error, isLoading } = useQuery({
    queryKey: ["forms", formSlug, workspaceSlug, orgSlug],
    queryFn: () => getFormWithSteps(formSlug, workspaceSlug, orgSlug),
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
      ]);

      const newForm = {
        ...previousForm,
        stepOrder: args.data.stepOrder,
        steps: [...previousForm.steps].sort(
          (a, b) =>
            args.data.stepOrder.indexOf(a.id) -
            args.data.stepOrder.indexOf(b.id)
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
  const currentStep = data.steps.find((step) => step.id === s);

  const reorderSteps = async (e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      const activeStepIndex = data.stepOrder.findIndex(
        (id) => id === e.active.id
      );
      const overStepIndex = data.stepOrder.findIndex((id) => id === e.over?.id);

      if (activeStepIndex < 0 || overStepIndex < 0) return;

      const newStepList = arrayMove(
        data.stepOrder,
        activeStepIndex,
        overStepIndex
      );

      await mutateAsync({
        where: {
          id: data.id,
        },
        data: {
          stepOrder: newStepList,
        },
      });
    }
  };

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1">
        <div className="h-[500px] w-full p-4 bg-slate-100 inset-0  bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="shadow h-full w-full rounded-md overflow-hidden">
            <MapForm
              currentStep={currentStep}
              mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              onDescriptionChange={async (content: string) => {
                await debouncedUpdateStep({
                  where: {
                    id: s,
                  },
                  data: {
                    description: content,
                  },
                });
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
        <div className="border-t">
          <form action={createStepWithFromId}>
            <input name="type" value="CONTENT" />
            <Button>New step</Button>
          </form>
          <DndContext onDragEnd={reorderSteps} sensors={sensors}>
            <div className="flex gap-1">
              <SortableContext items={data.steps}>
                {data.steps.map((step) => (
                  <Draggable id={step.id} key={step.id}>
                    <button
                      className="bg-blue-200 py-2 px-4 rounded-md"
                      onClick={() => {
                        setCurrentStep(step);
                      }}
                      type="button"
                    >
                      {step.id}: {step.type}
                    </button>
                  </Draggable>
                ))}
              </SortableContext>
            </div>
          </DndContext>
        </div>
      </div>
      <Sidebar stepId={currentStep?.id} />
    </div>
  );
}
