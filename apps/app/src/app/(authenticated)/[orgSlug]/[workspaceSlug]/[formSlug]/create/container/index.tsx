"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import type { Step } from "@mapform/db";
import type { MapRef, ViewState } from "@mapform/mapform";
import { MapForm } from "@mapform/mapform";
import { Button } from "@mapform/ui/components/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { env } from "~/env.mjs";
import type { FormType, StepsType } from "../actions";
import { createStep } from "../actions";
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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const setCurrentStep = (step: StepsType[number]) => {
    console.log(1111, step);
    map.current?.flyTo({
      center: [step.longitude, step.latitude],
      duration: 1000,
    });
    router.push(`${pathname}?${createQueryString("s", step.id)}`);
  };

  useEffect(() => {
    if (steps[0] && !s) {
      router.push(`${pathname}?${createQueryString("s", steps[0].id)}`);
    }
  }, [s, steps, pathname, router, createQueryString]);

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1">
        <div className="h-[500px] w-full p-4 bg-slate-100 inset-0  bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="shadow h-full w-full rounded-md overflow-hidden">
            <MapForm
              mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
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
          {steps.map((step, i) => (
            <button
              className="bg-blue-200"
              key={step.id}
              onClick={() => {
                // setCurrentStep(step.id);
                setCurrentStep(step);
              }}
              type="button"
            >
              {i + 1}: {step.type}
            </button>
          ))}
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
