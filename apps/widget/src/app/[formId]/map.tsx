"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { MapRef, ViewState } from "@mapform/mapform";
import { MapForm } from "@mapform/mapform";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { env } from "../env.mjs";
import type { FormWithSteps } from "./getters";

interface MapProps {
  formWithSteps: NonNullable<FormWithSteps>;
}

type Step = NonNullable<FormWithSteps>["steps"][0];

export function Map({ formWithSteps }: MapProps) {
  const fisrtStep = formWithSteps.steps[0];

  const initialViewState = {
    longitude: fisrtStep!.longitude,
    latitude: fisrtStep!.latitude,
    zoom: fisrtStep!.zoom,
    bearing: fisrtStep!.bearing,
    pitch: fisrtStep!.pitch,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  };
  const router = useRouter();
  const map = useRef<MapRef>(null);
  // const [currentStep, setCurrentStep] = useState(fisrtStep);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const s = searchParams.get("s");
  const [viewState, setViewState] = useState<ViewState>(initialViewState);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const setCurrentStep = (step: Step) => {
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
    if (formWithSteps.steps[0] && !s) {
      router.push(
        `${pathname}?${createQueryString("s", formWithSteps.steps[0].id)}`
      );
    }
  }, [s, formWithSteps.steps, pathname, router, createQueryString]);

  if (!s) {
    return null;
  }

  const currentStep = formWithSteps.steps.find((step) => step.id === s);

  return (
    <MapForm
      currentStep={currentStep}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      onNext={() => {
        const nextStepIndex =
          formWithSteps.steps.findIndex((step) => step.id === currentStep!.id) +
          1;
        setCurrentStep(formWithSteps.steps[nextStepIndex]);
      }}
      onPrev={() => {
        const prevStepIndex =
          formWithSteps.steps.findIndex((step) => step.id === currentStep!.id) -
          1;
        setCurrentStep(formWithSteps.steps[prevStepIndex]);
      }}
      // onLoad={() => {
      //   setMapformLoaded(true);
      // }}
      ref={map}
      setViewState={(evt) => {
        setViewState(evt.viewState);
      }}
      viewState={viewState}
    />
  );
}
