"use client";

import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapFormProps {
  mapboxAccessToken: string;
  // initialViewState: {
  //   longitude: number;
  //   latitude: number;
  //   zoom: number;
  // };
}

export function MapForm({ mapboxAccessToken }: MapFormProps) {
  return (
    <div className="flex w-full h-full">
      <div className="w-32 flex-shrink-0 bg-red-200">Sidebar</div>
      <Map
        mapboxAccessToken={mapboxAccessToken}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{ flex: 1 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </div>
  );
}
