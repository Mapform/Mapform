import { useEffect, useRef } from "react";
import { Marker, useMap } from "react-map-gl/mapbox";
import type { LocationResult } from "~/lib/ai/tools/autocomplete";
import { FeatureList } from "~/components/feature-list";
import { useParamsContext } from "~/lib/params/client";
import { useWikidataImages } from "~/lib/wikidata-image";

interface AutocompleteMessageProps {
  result: LocationResult | undefined;
}

export function AutocompleteMessage({ result }: AutocompleteMessageProps) {
  const map = useMap();
  const { setQueryStates } = useParamsContext();
  const hasFlownToRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      map.current &&
      result &&
      typeof result.lat === "number" &&
      typeof result.lon === "number"
    ) {
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

  // const wikiData = useWikidataImages(
  //   result?.datasource?.raw?.wikidata,
  // );

  if (!result) return null;

  if (
    typeof result.lat !== "number" ||
    typeof result.lon !== "number" ||
    isNaN(result.lat) ||
    isNaN(result.lon)
  ) {
    return null;
  }

  const features = [
    {
      id: result.place_id,
      name: result.address_line1,
      description: result.address_line2,
      icon: null,
      coordinates: [result.lon, result.lat] as [number, number],
      // image: {
      //   url: wikiData.primaryImage?.imageUrl ?? "",
      // },
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
      <Marker longitude={result.lon} latitude={result.lat} anchor="center" />
      <FeatureList features={features} onClick={handleFeatureClick} />
    </>
  );
}
