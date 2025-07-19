"use client";

import { useEffect } from "react";
import { useMapPadding } from "~/lib/map/use-map-padding";
import { useMap } from "react-map-gl/mapbox";

export function MapPadding({ forceOpen }: { forceOpen?: boolean }) {
  const map = useMap();
  const padding = useMapPadding(forceOpen);

  useEffect(() => {
    if (!map.current) return;

    map.current.easeTo({
      padding,
      duration: 750,
    });
  }, [map, padding]);

  return null;
}
