"use client";

import { Map, MapRoot } from "~/components/map";
import { Header } from "../header";

export function MapView() {
  return (
    <MapRoot>
      <div className="relative h-full">
        <Map className="size-full rounded-lg" />
        <Header className="absolute left-4 top-4 z-10 w-fit p-4" />
      </div>
    </MapRoot>
  );
}
