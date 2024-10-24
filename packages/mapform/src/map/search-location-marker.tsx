import type mapboxgl from "mapbox-gl";
import { Marker } from "mapbox-gl";
import { useRef, useEffect } from "react";
import type { PlacesSearchResponse } from "@mapform/map-utils/types";
import ReactDOM from "react-dom";
import { useMapform } from "../context";

/**
 * Update searchLocationMarker marker
 */
export function SearchLocationMarker({
  searchLocationMarker,
  children,
}: {
  searchLocationMarker: PlacesSearchResponse["features"][number] | null;
  children: React.ReactNode;
}) {
  const { map } = useMapform();
  const markerEl = useRef<mapboxgl.Marker | null>(null);
  const markerElInner = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    const currentLngLat = markerEl.current?.getLngLat();
    if (
      map &&
      searchLocationMarker?.properties &&
      currentLngLat?.lat !== searchLocationMarker.properties.lat &&
      currentLngLat?.lng !== searchLocationMarker.properties.lon
    ) {
      ReactDOM.render(<>{children}</>, markerElInner.current);
      markerEl.current?.remove();
      markerEl.current = new Marker(markerElInner.current)
        .setLngLat([
          searchLocationMarker.properties.lon,
          searchLocationMarker.properties.lat,
        ])
        .addTo(map);
    }

    if (map && !searchLocationMarker) {
      markerEl.current?.remove();
    }
  }, [map, searchLocationMarker, children]);

  return null;
}
