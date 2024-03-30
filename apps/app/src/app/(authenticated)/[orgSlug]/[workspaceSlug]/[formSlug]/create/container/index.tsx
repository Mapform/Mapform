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
import { env } from "~/env.mjs";
import type { FormType, StepsType } from "../actions";
import { createStep, updateStep } from "../actions";
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
  form,
  steps,
}: {
  form: NonNullable<FormType>;
  steps: NonNullable<StepsType>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const s = searchParams.get("s");
  const [viewState, setViewState] = useState<ViewState>(initialViewState);
  const createStepWithFromId = createStep.bind(null, form.id, viewState);
  const map = useRef<MapRef>(null);
  const [isDropped, setIsDropped] = useState(false);

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
    if (steps[0] && !s) {
      router.push(`${pathname}?${createQueryString("s", steps[0].id)}`);
    }
  }, [s, steps, pathname, router, createQueryString]);

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

  if (!s) {
    return null;
  }

  const currentStep = steps.find((step) => step.id === s);

  const reorderSteps = async (e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      const oldOrder = steps.find((step) => step.id === e.active.id)?.order;
      const newOrder = steps.find((step) => step.id === e.over?.id)?.order;

      console.log(11111, oldOrder, newOrder);
      // setGamesList((gamesList) => {
      //   return arrayMove(gamesList, oldIdx, newIdx);
      // });
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
                  stepId: s,
                  description: content,
                });
              }}
              onTitleChange={async (content: string) => {
                await debouncedUpdateStep({
                  stepId: s,
                  title: content,
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
              <SortableContext items={steps}>
                {steps.map((step) => (
                  <Draggable id={step.id} key={step.id}>
                    <button
                      className="bg-blue-200 py-2 px-4 rounded-md"
                      onClick={() => {
                        console.log(11111);
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
