"use client";

import { useCallback, useEffect, useState } from "react";
import { MapForm } from "@mapform/mapform";
import { Button } from "@mapform/ui/components/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { env } from "~/env.mjs";
import type { FormType } from "../actions";
import { createStep } from "../actions";

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

export function Container({ form }: { form: NonNullable<FormType> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createStepWithFromId = createStep.bind(null, form.id, initialViewState);
  const s = searchParams.get("s");
  const [viewState, setViewState] = useState(initialViewState);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const setCurrentStep = useCallback(
    (stepId: string) => {
      router.push(`${pathname}?${createQueryString("s", stepId)}`);
    },
    [createQueryString, pathname, router]
  );

  useEffect(() => {
    if (form.steps[0] && !s) {
      router.push(`${pathname}?${createQueryString("s", form.steps[0].id)}`);
    }
  }, [s, form.steps, pathname, router, createQueryString]);

  const currentStep = form.steps.find((step) => step.id === s);

  useEffect(() => {
    if (currentStep) {
      setViewState({
        ...initialViewState,
        longitude: currentStep.longitude,
        latitude: currentStep.latitude,
        zoom: currentStep.zoom,
        pitch: currentStep.pitch,
        bearing: currentStep.bearing,
      });
    }
  }, [currentStep]);

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1">
        <div className="h-[500px] w-full p-4 bg-slate-100">
          <MapForm
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            setViewState={(evt) => {
              setViewState(evt.viewState);
            }}
            viewState={viewState}
          />
        </div>
        <div className="border-t">
          <form action={createStepWithFromId}>
            <input name="type" value="CONTENT" />
            <Button>New step</Button>
          </form>
          {form.steps.map((step, i) => (
            <button
              className="bg-blue-200"
              key={step.id}
              onClick={() => {
                setCurrentStep(step.id);
              }}
              type="button"
            >
              {i + 1}: {step.type}
            </button>
          ))}
        </div>
      </div>
      {/* SIDE BAR */}
      <div className="w-[400px] border-l">Side</div>
    </div>
  );
}
