import type mapboxgl from "mapbox-gl";
import { Marker } from "mapbox-gl";
import { useRef, useEffect } from "react";
import * as Portal from "@radix-ui/react-portal";
import { useMapform } from "../context";

/**
 * Update searchLocationMarker marker
 */
export function LocationMarker({
  longitude,
  latitude,
  markerOptions,
  children,
}: {
  longitude: number;
  latitude: number;
  markerOptions?: mapboxgl.MarkerOptions;
  children: React.ReactNode;
}) {
  const { map } = useMapform();
  const markerEl = useRef<mapboxgl.Marker | null>(null);
  const markerElInner = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    const currentLngLat = markerEl.current?.getLngLat();
    if (
      map &&
      currentLngLat?.lat !== latitude &&
      currentLngLat?.lng !== longitude
    ) {
      markerEl.current?.remove();
      markerEl.current = new Marker(markerElInner.current, markerOptions)
        .setLngLat([longitude, latitude])
        .addTo(map);
    }

    return () => {
      markerEl.current?.remove();
    };
  }, [map, children, markerOptions, latitude, longitude]);

  return (
    <Portal.Root container={markerElInner.current}>{children}</Portal.Root>
  );
}
