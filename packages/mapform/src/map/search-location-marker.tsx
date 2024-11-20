import type mapboxgl from "mapbox-gl";
import { Marker } from "mapbox-gl";
import { useRef, useEffect } from "react";
import type { SearchFeature } from "@mapform/map-utils/types";
import * as Portal from "@radix-ui/react-portal";
import { useMapform } from "../context";

/**
 * Update searchLocationMarker marker
 */
export function SearchLocationMarker({
  searchLocationMarker,
  children,
}: {
  searchLocationMarker: SearchFeature | null;
  children: React.ReactNode;
}) {
  const { map } = useMapform();
  const markerEl = useRef<mapboxgl.Marker | null>(null);
  const markerElInner = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    const currentLngLat = markerEl.current?.getLngLat();
    if (
      map &&
      searchLocationMarker &&
      currentLngLat?.lat !== searchLocationMarker.latitude &&
      currentLngLat?.lng !== searchLocationMarker.longitude
    ) {
      markerEl.current?.remove();
      markerEl.current = new Marker(markerElInner.current)
        .setLngLat([
          searchLocationMarker.longitude,
          searchLocationMarker.latitude,
        ])
        .addTo(map);
    }

    if (map && !searchLocationMarker) {
      markerEl.current?.remove();
    }
  }, [map, searchLocationMarker, children]);

  return (
    <Portal.Root container={markerElInner.current}>{children}</Portal.Root>
  );
}
