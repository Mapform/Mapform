"use client";

import { Map, MapRoot } from "~/components/map";

export function MapView() {
  return (
    <MapRoot>
      <Map className="size-full rounded-lg" />
    </MapRoot>
  );
}
