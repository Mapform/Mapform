"use client";

import { Skeleton } from "@mapform/ui/components/skeleton";
import { MapDrawer } from "~/components/map-drawer";

export default function Loading() {
  return (
    <MapDrawer open={true}>
      <div className="flex flex-col gap-4">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </MapDrawer>
  );
}
