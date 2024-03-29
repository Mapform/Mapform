"use client";

import type { MapRef, ViewState, ViewStateChangeEvent } from "react-map-gl";
import Map, { MapProvider, useMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { forwardRef } from "react";
import type { Step } from "@mapform/db";
import { Tiptap } from "./TipTap";

interface MapFormProps {
  mapboxAccessToken: string;
  viewState: ViewState;
  setViewState: (viewState: ViewStateChangeEvent) => void;
  steps: (Step & { latitude: number; longitude: number })[];
  currentStepId: string | null;
}

export const MapForm = forwardRef<MapRef, MapFormProps>(
  (
    { mapboxAccessToken, viewState, setViewState, steps, currentStepId },
    ref
  ) => {
    return (
      <div className="flex w-full h-full">
        <div className="w-64 flex-shrink-0 bg-background p-4">
          <Tiptap />
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
