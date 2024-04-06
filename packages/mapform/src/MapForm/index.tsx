"use client";

import type {
  FillLayer,
  MapRef,
  ViewState,
  ViewStateChangeEvent,
} from "react-map-gl";
import Map, { Layer, MapProvider, useMap } from "react-map-gl";
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

/**
 * TODO: This adds 3D buildings to the map, but there might be a better way
 * https://github.com/alex3165/react-mapbox-gl/issues/79
 */
const parkLayer: FillLayer = {
  id: "add-3d-buildings",
  source: "composite",
  "source-layer": "building",
  filter: ["==", "extrude", "true"],
  type: "fill-extrusion",
  minzoom: 15,
  paint: {
    "fill-extrusion-color": "#e6e4e0",

    // Use an 'interpolate' expression to
    // add a smooth transition effect to
    // the buildings as the user zooms in.
    "fill-extrusion-height": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "height"],
    ],
    "fill-extrusion-base": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "min_height"],
    ],
    "fill-extrusion-opacity": 0.6,
  },
};

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
          mapStyle="mapbox://styles/nichaley/clsxaiasf00ue01qjfhtt2v81"
          // mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={mapboxAccessToken}
          onMove={setViewState}
          ref={ref}
          style={{ flex: 1 }}
        >
          {/* <Layer {...parkLayer} /> */}
        </Map>
      </div>
    );
  }
);

MapForm.displayName = "MapForm";

export { MapProvider, useMap };
export type { ViewState, ViewStateChangeEvent, MapRef };
