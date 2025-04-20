import { useQuery } from "@tanstack/react-query";
import type { GeoapifyPlace } from "@mapform/map-utils/types";
import { useState } from "react";

export function useReverseGeocode(map: mapboxgl.Map | null) {
  const [isFetching, setIsFetching] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<
    GeoapifyPlace["features"][number] | null
  >(null);

  const reverseGeocode = async ({ lat, lng }: { lat: number; lng: number }) => {
    setIsFetching(true);
    const response = await fetch(
      `/api/places/reverse-geocode?lat=${lat}&lng=${lng}`,
    );

    setIsFetching(false);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const result = json.data as GeoapifyPlace;
    const firstFeature = result.features[0];

    if (firstFeature) {
      setSelectedFeature({
        ...firstFeature,
        ...(firstFeature.properties && {
          properties: {
            ...firstFeature.properties,
            lat,
            lon: lng,
          },
        }),
      });
    }

    return result;
  };

  const { refetch } = useQuery({
    enabled: false,
    queryKey: ["reverse-geocode", map?.getCenter().lat, map?.getCenter().lng],
    queryFn: () =>
      map
        ? reverseGeocode({
            lat: map.getCenter().lat,
            lng: map.getCenter().lng,
          })
        : Promise.reject(new Error("Map not available")),
    placeholderData: (prev) => prev,
    staleTime: Infinity,
    retry: false,
  });

  return {
    isFetching,
    selectedFeature,
    refetch,
    setSelectedFeature,
  };
}
