import { useEffect } from "react";
import { Marker, useMap } from "react-map-gl/mapbox";
import type { LocationResult } from "~/lib/ai/tools/reverse-geocode";

interface ReverseGeocodeMessageProps {
  result: LocationResult | undefined;
}

export function ReverseGeocodeMessage({ result }: ReverseGeocodeMessageProps) {
  const map = useMap();

  useEffect(() => {
    if (map.current && result) {
      map.current.flyTo({
        center: [result.lon, result.lat],
        duration: 1000,
      });
    }
  }, [map, result]);

  if (!result) return null;

  return (
    <Marker longitude={result.lon} latitude={result.lat} anchor="center" />
  );
}
