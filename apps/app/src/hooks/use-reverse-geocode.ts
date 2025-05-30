import { useQuery, type QueryOptions } from "@tanstack/react-query";
import type { GeoapifyPlace } from "@mapform/map-utils/types";
import { useState } from "react";

export function useReverseGeocode({
  lat,
  lng,
  retry,
  enabled,
}: {
  lat: number | null;
  lng: number | null;
  retry?: QueryOptions["retry"];
  enabled?: boolean;
}) {
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
    enabled,
    queryKey: ["reverse-geocode", lat, lng],
    queryFn: () =>
      lat !== null && lng !== null
        ? reverseGeocode({ lat, lng })
        : Promise.reject(new Error("Coordinates not available")),
    placeholderData: (prev) => prev,
    staleTime: Infinity,
    retry,
  });

  return {
    isFetching,
    selectedFeature,
    refetch,
    setSelectedFeature,
  };
}
