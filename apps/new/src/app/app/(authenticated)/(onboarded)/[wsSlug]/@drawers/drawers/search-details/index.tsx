"use client";

import { MapDrawer } from "~/components/map-drawer";
import type { GetPlaceDetails } from "@mapform/backend/data/geoapify/details";
import { useParamsContext } from "~/lib/params/client";
import { Marker } from "react-map-gl/mapbox";

interface SearchDetailsProps {
  geoapifyPlaceDetails: GetPlaceDetails["data"];
}

export function SearchDetails({ geoapifyPlaceDetails }: SearchDetailsProps) {
  const { params, setQueryStates } = useParamsContext();

  if (!geoapifyPlaceDetails) return null;

  const longitude = geoapifyPlaceDetails.features[0]?.properties.lon;
  const latitude = geoapifyPlaceDetails.features[0]?.properties.lat;

  if (!longitude || !latitude) return null;

  return (
    <MapDrawer
      open={!!params.geoapifyPlaceId}
      onClose={() => {
        void setQueryStates({
          geoapifyPlaceId: null,
        });
      }}
    >
      Test
      <Marker longitude={longitude} latitude={latitude} />
    </MapDrawer>
  );
}
