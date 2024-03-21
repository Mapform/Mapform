"use client";

import Map, {
  MapRef,
  ViewState,
  ViewStateChangeEvent,
  MapProvider,
  useMap,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Tiptap } from "./TipTap";
import { forwardRef } from "react";

interface MapFormProps {
  mapboxAccessToken: string;
  viewState: ViewState;
  setViewState: (viewState: ViewStateChangeEvent) => void;
}

export const MapForm = forwardRef<MapRef, MapFormProps>(
  ({ mapboxAccessToken, viewState, setViewState }, ref) => {
    return (
      <div className="flex w-full h-full">
        <div className="w-64 flex-shrink-0 bg-background">
          <Tiptap />
        </div>
        <Map
          {...viewState}
          style={{ flex: 1 }}
          onMove={setViewState}
          mapboxAccessToken={mapboxAccessToken}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          ref={ref}
        />
      </div>
    );
  }
);
export { MapProvider, useMap };
export type { ViewState, ViewStateChangeEvent, MapRef };
