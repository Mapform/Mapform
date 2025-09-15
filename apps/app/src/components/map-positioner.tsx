"use client";

import { useMap } from "react-map-gl/mapbox";
import { useMapPadding } from "~/lib/map/use-map-padding";
import { useEffect } from "react";

export function MapPositioner({
  children,
  center,
  pitch,
  bearing,
  zoom,
  listenToChanges = false,
}: {
  children: React.ReactNode;
  center?: [number, number];
  pitch?: number;
  bearing?: number;
  zoom?: number;
  listenToChanges?: boolean;
}) {
  const map = useMap();
  const padding = useMapPadding();

  // useEffect(
  //   () => {
  //     if (!map.current) return;

  //     map.current.easeTo({
  //       center,
  //       padding,
  //       ...(pitch !== undefined && { pitch }),
  //       ...(bearing !== undefined && { bearing }),
  //       ...(zoom !== undefined && { zoom }),
  //     });
  //   },
  //   listenToChanges ? [center, padding, pitch, bearing, zoom] : [],
  // );

  return <>{children}</>;
}
