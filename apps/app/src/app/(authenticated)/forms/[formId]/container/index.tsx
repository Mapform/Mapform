"use client";

import { useEffect, useState, useRef } from "react";
import type { MapRef, ViewState } from "@mapform/mapform";
import { MapForm } from "@mapform/mapform";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@mapform/lib/use-debounce";
import { Spinner } from "@mapform/ui/components/spinner";
import { cn } from "@mapform/lib/classnames";
import { env } from "~/env.mjs";
import { updateStep } from "~/server/actions/steps/update";
import { useCreateQueryString } from "~/lib/create-query-string";
import { type FormWithSteps } from "../requests";
import { Steps } from "./steps";
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

export function Container({ formWithSteps }: { formWithSteps: FormWithSteps }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  const s = searchParams.get("s");
  const [mapformLoaded, setMapformLoaded] = useState(false);
  const map = useRef<MapRef>(null);
  const [dragSteps, setDragSteps] = useState<FormWithSteps["steps"]>(
    formWithSteps.steps ?? []
  );

  const currentStep = dragSteps.find((step) => step.id === s);
  const [viewState, setViewState] = useState<ViewState>({
    latitude: currentStep?.latitude ?? initialViewState.latitude,
    longitude: currentStep?.longitude ?? initialViewState.longitude,
    zoom: currentStep?.zoom ?? initialViewState.zoom,
    bearing: currentStep?.bearing ?? initialViewState.bearing,
    pitch: currentStep?.pitch ?? initialViewState.pitch,
    padding: initialViewState.padding,
  });

  useEffect(() => {
    if (formWithSteps.steps[0] && !s) {
      router.push(
        `${pathname}?${createQueryString("s", formWithSteps.steps[0].id)}`
      );
    }
  }, [s, formWithSteps.steps, pathname, router, createQueryString]);

  const debouncedUpdateStep = useDebounce(updateStep, 500);

  return (
    // Radial gradient in case I want to add back bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
    <div className="relative flex flex-col flex-1 bg-gray-50">
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
        <div className="flex flex-1">
          {/* MAP */}
          <div className="p-8 flex-1 flex justify-center">
            <div className="max-w-screen-lg flex-1 border overflow-hidden">
              <MapForm
                currentStep={currentStep}
                editable
                mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                onDescriptionChange={async (content: { content: any[] }) => {
                  if (!s) {
                    return;
                  }

                  await debouncedUpdateStep({
                    stepId: s,
                    data: {
                      description: content,
                      formId: formWithSteps.id,
                    },
                  });
                }}
                onLoad={() => {
                  setMapformLoaded(true);
                }}
                onTitleChange={async (content: string) => {
                  if (!s) {
                    return;
                  }

                  await debouncedUpdateStep({
                    stepId: s,
                    data: {
                      title: content,
                      formId: formWithSteps.id,
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

          {/* SIDEBAR */}
          <Sidebar
            currentStep={currentStep}
            setDragSteps={setDragSteps}
            setViewState={setViewState}
            viewState={viewState}
          />
        </div>

        {/* STEPS */}
        <Steps
          currentStep={currentStep}
          dragSteps={dragSteps}
          formId={formWithSteps.id}
          map={map}
          setDragSteps={setDragSteps}
          viewState={viewState}
        />
      </div>
    </div>
  );
}
