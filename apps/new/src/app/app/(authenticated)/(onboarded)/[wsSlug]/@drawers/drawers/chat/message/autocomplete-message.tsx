import { useEffect, useRef } from "react";
import { Marker, useMap } from "react-map-gl/mapbox";
import type { LocationResult } from "~/lib/ai/tools/autocomplete";

interface AutocompleteMessageProps {
  result: LocationResult | undefined;
}

export function AutocompleteMessage({ result }: AutocompleteMessageProps) {
  const map = useMap();
  const hasFlownToRef = useRef<string | null>(null);

  useEffect(() => {
    if (map.current && result) {
      // Create a unique key for this location
      const locationKey = `${result.lon},${result.lat}`;

      // Only fly to if we haven't flown to this exact location before
      if (hasFlownToRef.current !== locationKey) {
        map.current.flyTo({
          center: [result.lon, result.lat],
          duration: 1000,
        });
        hasFlownToRef.current = locationKey;
      }
    }
  }, [map, result]);

  if (!result) return null;

  return (
    <Marker longitude={result.lon} latitude={result.lat} anchor="center" />
  );
}
