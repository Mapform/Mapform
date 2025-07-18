"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import type { GetPlaceDetails } from "@mapform/backend/data/geoapify/details";
import { useParamsContext } from "~/lib/params/client";
import { Marker } from "react-map-gl/mapbox";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";

interface SearchDetailsProps {
  geoapifyPlaceDetails: GetPlaceDetails["data"];
}

export function SearchDetails({ geoapifyPlaceDetails }: SearchDetailsProps) {
  const { params, drawerDepth } = useParamsContext();

  return (
    <MapDrawer
      open={!!params.geoapifyPlaceId}
      depth={drawerDepth.get("geoapifyPlaceId") ?? 0}
    >
      <SearchDetailsInner geoapifyPlaceDetails={geoapifyPlaceDetails} />
    </MapDrawer>
  );
}

function SearchDetailsInner({ geoapifyPlaceDetails }: SearchDetailsProps) {
  const { params, setQueryStates } = useParamsContext();

  if (!geoapifyPlaceDetails) return null;

  const longitude = geoapifyPlaceDetails.features[0]?.properties.lon;
  const latitude = geoapifyPlaceDetails.features[0]?.properties.lat;

  if (!longitude || !latitude) return null;

  return (
    <>
      <MapDrawerToolbar>
        <Button
          className="ml-auto"
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={() => {
            void setQueryStates({ geoapifyPlaceId: null });
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </MapDrawerToolbar>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-6">
        Test
      </div>
      <Marker longitude={longitude} latitude={latitude} />
    </>
  );
}
