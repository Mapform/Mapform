import type { CustomBlock } from "@mapform/blocknote";
import type mapboxgl from "mapbox-gl";
import { Marker } from "mapbox-gl";
import { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useMapform } from "../context";

/**
 * Update searchLocationMarker marker
 */
export function SearchLocationMarker({
  searchLocationMarker,
  children,
}: {
  searchLocationMarker: {
    latitude: number;
    longitude: number;
    name: string;
    description?: {
      content: CustomBlock[];
    };
  } | null;
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
      ReactDOM.render(<>{children}</>, markerElInner.current);
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

  return null;
}
