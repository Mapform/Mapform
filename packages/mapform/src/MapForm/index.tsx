"use client";

import Map from "react-map-gl";

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
    <Map
      mapboxAccessToken={mapboxAccessToken}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: 600, height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}
