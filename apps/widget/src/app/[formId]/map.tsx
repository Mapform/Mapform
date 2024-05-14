"use client";

import React, { useState } from "react";
import type { ViewState } from "@mapform/mapform";
import { MapForm } from "@mapform/mapform";
import { env } from "../env.mjs";
import type { FormWithSteps } from "./getters";

interface MapProps {
  formWithSteps: NonNullable<FormWithSteps>;
}

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
  const [currentStep, setCurrentStep] = useState(fisrtStep);
  const [viewState, setViewState] = useState<ViewState>(initialViewState);

  return (
    <MapForm
      currentStep={currentStep}
      editable
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      // onLoad={() => {
      //   setMapformLoaded(true);
      // }}
      setViewState={(evt) => {
        setViewState(evt.viewState);
      }}
      viewState={viewState}
    />
  );
}
