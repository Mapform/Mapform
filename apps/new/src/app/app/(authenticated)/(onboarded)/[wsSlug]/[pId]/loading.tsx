"use client";

import { BasicSkeleton } from "~/components/skeletons/basic";
import { MapDrawer } from "~/components/map-drawer";

export default function Loading() {
  return (
    <MapDrawer open>
      <BasicSkeleton className="p-6" />
    </MapDrawer>
  );
}
