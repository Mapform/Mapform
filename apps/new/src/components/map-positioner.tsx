"use client";

import { useMap } from "react-map-gl/mapbox";
import { useMapPadding } from "~/lib/map/use-map-padding";
import { useEffect } from "react";

export function MapPositioner({
  children,
  center,
  listenToChanges = false,
}: {
  children: React.ReactNode;
  center?: [number, number];
  listenToChanges?: boolean;
}) {
  const map = useMap();
  const padding = useMapPadding();

  useEffect(
    () => {
      if (!map.current) return;

      map.current.easeTo({
        center,
        padding,
      });
    },
    listenToChanges ? [center, padding] : [],
  );

  return <>{children}</>;
}
