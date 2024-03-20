"use client";

import Map, { ViewState, ViewStateChangeEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Tiptap } from "./TipTap";

interface MapFormProps {
  mapboxAccessToken: string;
  viewState: ViewState;
  setViewState: (viewState: ViewStateChangeEvent) => void;
}

export function MapForm({
  mapboxAccessToken,
  viewState,
  setViewState,
}: MapFormProps) {
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
      />
    </div>
  );
}
