import { useEffect, useRef } from "react";
import { Marker, useMap } from "react-map-gl/mapbox";
import { FeatureList } from "~/components/feature-list";
import type { GetInformationResponse } from "~/lib/ai/tools/get-information";
import { useParamsContext } from "~/lib/params/client";

interface GetInformationMessageProps {
  result: GetInformationResponse | undefined;
}

export function GetInformationMessage({ result }: GetInformationMessageProps) {
  const map = useMap();
  const { setQueryStates } = useParamsContext();
  const hasFlownToRef = useRef<string | null>(null);

  const placeDetails = result?.data?.[0];

  useEffect(() => {
    if (
      map.current &&
      placeDetails &&
      typeof placeDetails.center.coordinates[0] === "number" &&
      typeof placeDetails.center.coordinates[1] === "number"
    ) {
      // Create a unique key for this location
      const locationKey = `${placeDetails.center.coordinates[0]},${placeDetails.center.coordinates[1]}`;

      // Only fly to if we haven't flown to this exact location before
      if (hasFlownToRef.current !== locationKey) {
        map.current.flyTo({
          center: placeDetails.center.coordinates,
          duration: 1000,
        });
        hasFlownToRef.current = locationKey;
      }
    }
  }, [map, placeDetails]);

  if (!placeDetails) return null;

  if (
    typeof placeDetails.center.coordinates[0] !== "number" ||
    typeof placeDetails.center.coordinates[1] !== "number" ||
    isNaN(placeDetails.center.coordinates[0]) ||
    isNaN(placeDetails.center.coordinates[1])
  ) {
    return null;
  }

  const features = [
    {
      id: placeDetails.id,
      name: placeDetails.name ?? "",
      description: "",
      icon: null,
      coordinates: placeDetails.center.coordinates,
      // image: placeDetails.
    },
  ];

  const handleFeatureClick = (feature: {
    id: string;
    coordinates: [number, number];
  }) => {
    if (map.current) {
      map.current.flyTo({
        center: feature.coordinates,
        duration: 1000,
      });
    }

    void setQueryStates({ geoapifyPlaceId: feature.id });
  };

  return (
    <>
      <Marker
        longitude={placeDetails.center.coordinates[0]}
        latitude={placeDetails.center.coordinates[1]}
        anchor="center"
      />
      <FeatureList features={features} onClick={handleFeatureClick} />
    </>
  );
}
