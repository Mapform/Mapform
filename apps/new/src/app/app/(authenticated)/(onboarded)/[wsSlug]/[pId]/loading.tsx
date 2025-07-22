"use client";

import { LoadingSkeleton } from "~/components/loading-skeleton";
import { MapDrawer } from "~/components/map-drawer";

export default function Loading() {
  return (
    <MapDrawer animateOut={false}>
      <LoadingSkeleton />
    </MapDrawer>
  );
}
