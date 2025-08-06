import { useEffect } from "react";
import { Marker, useMap } from "react-map-gl/mapbox";
import type { GetPlaceDetails } from "@mapform/backend/data/geoapify/details";
import { FeatureList } from "~/components/feature-list";
import { useParamsContext } from "~/lib/params/client";
import { useWikidataImages } from "~/lib/wikidata-image";

interface ReverseGeocodeMessageProps {
  result: NonNullable<GetPlaceDetails["data"]>["features"][number] | undefined;
}

export function ReverseGeocodeMessage({ result }: ReverseGeocodeMessageProps) {
  const map = useMap();
  const { setQueryStates } = useParamsContext();

  useEffect(() => {
    if (map.current && result) {
      map.current.flyTo({
        center: [result.properties.lon, result.properties.lat],
        duration: 1000,
      });
    }
  }, [map, result]);

  const wikiData = useWikidataImages(
    result?.properties.datasource?.raw?.wikidata,
  );

  if (!result) return null;

  const features = [
    {
      id: result.properties.place_id,
      name: result.properties.name ?? "",
      description: result.properties.address_line1,
      icon: null,
      coordinates: [result.properties.lon, result.properties.lat] as [
        number,
        number,
      ],
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
        longitude={result.properties.lon}
        latitude={result.properties.lat}
        anchor="center"
      />
      <FeatureList features={features} onClick={handleFeatureClick} />
    </>
  );
}
