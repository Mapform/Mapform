"use client";

import { MapDrawer } from "~/components/map-drawer";
import { Loader2 } from "lucide-react";

export function LoadingDrawer() {
  return (
    <MapDrawer open={true}>
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    </MapDrawer>
  );
}
