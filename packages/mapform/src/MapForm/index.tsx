"use client";

import type { MapRef, ViewState, ViewStateChangeEvent } from "react-map-gl";
import Map, { MapProvider, useMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { forwardRef } from "react";
import type { Step } from "@mapform/db";
import { Tiptap } from "./TipTap";

type ExtendedStep = Step & { latitude: number; longitude: number };

interface MapFormProps {
  mapboxAccessToken: string;
  currentStep?: ExtendedStep;
  viewState: ViewState;
  setViewState: (viewState: ViewStateChangeEvent) => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: string) => void;
}

export const MapForm = forwardRef<MapRef, MapFormProps>(
  (
    {
      mapboxAccessToken,
      viewState,
      setViewState,
      currentStep,
      onTitleChange,
      onDescriptionChange,
    },
    ref
  ) => {
    if (!currentStep) {
      return null;
    }

    return (
      <div className="flex w-full h-full">
        <div className="w-64 flex-shrink-0 bg-background p-4">
          <Tiptap
            description={currentStep.description || undefined}
            id={currentStep.id}
            onDescriptionChange={onDescriptionChange}
            onTitleChange={onTitleChange}
            title={currentStep.title || undefined}
          />
        </div>
        <Map
          {...viewState}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={mapboxAccessToken}
          onMove={setViewState}
          ref={ref}
          style={{ flex: 1 }}
        />
      </div>
    );
  }
);

MapForm.displayName = "MapForm";

export { MapProvider, useMap };
export type { ViewState, ViewStateChangeEvent, MapRef };
