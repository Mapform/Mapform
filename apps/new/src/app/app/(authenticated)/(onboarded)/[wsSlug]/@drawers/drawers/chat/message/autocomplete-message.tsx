import { useEffect, useRef } from "react";
import { Marker, useMap } from "react-map-gl/mapbox";
import { FeatureList } from "~/components/feature-list";
import type { AutocompleteResponse } from "~/lib/ai/tools/autocomplete";
import { useParamsContext } from "~/lib/params/client";
import { useWikidataImages } from "~/lib/wikidata-image";

interface AutocompleteMessageProps {
  result: AutocompleteResponse | undefined;
}

export function AutocompleteMessage({ result }: AutocompleteMessageProps) {
  const map = useMap();
  const { setQueryStates } = useParamsContext();
  const hasFlownToRef = useRef<string | null>(null);

  const placeDetails = result?.data?.features[0]?.properties;

  useEffect(() => {
    if (
      map.current &&
      placeDetails &&
      typeof placeDetails.lat === "number" &&
      typeof placeDetails.lon === "number"
    ) {
      // Create a unique key for this location
      const locationKey = `${placeDetails.lon},${placeDetails.lat}`;

      // Only fly to if we haven't flown to this exact location before
      if (hasFlownToRef.current !== locationKey) {
        map.current.flyTo({
          center: [placeDetails.lon, placeDetails.lat],
          duration: 1000,
        });
        hasFlownToRef.current = locationKey;
      }
    }
  }, [map, placeDetails]);

  const wikiData = useWikidataImages(placeDetails?.datasource?.raw?.wikidata);

  if (!placeDetails) return null;

  if (
    typeof placeDetails.lat !== "number" ||
    typeof placeDetails.lon !== "number" ||
    isNaN(placeDetails.lat) ||
    isNaN(placeDetails.lon)
  ) {
    return null;
  }

  const features = [
    {
      id: placeDetails.place_id,
      name: placeDetails.address_line1,
      description: placeDetails.address_line2,
      icon: null,
      coordinates: [placeDetails.lon, placeDetails.lat] as [number, number],
      image: {
        url: wikiData.primaryImage?.imageUrl ?? "",
      },
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
        longitude={placeDetails.lon}
        latitude={placeDetails.lat}
        anchor="center"
      />
      <FeatureList features={features} onClick={handleFeatureClick} />
    </>
  );
}
