"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import type { GetPlaceDetails } from "@mapform/backend/data/geoapify/details";
import { useParamsContext } from "~/lib/params/client";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { BasicSkeleton } from "~/components/skeletons/basic";
import { PlaceDetailsContent } from "../../components/place-details-content";
import { useEffect } from "react";
import { Marker } from "react-map-gl/mapbox";

interface SearchDetailsProps {
  geoapifyPlaceDetails: GetPlaceDetails["data"];
}

export function SearchDetails({ geoapifyPlaceDetails }: SearchDetailsProps) {
  const { params, drawerDepth, isPending, setQueryStates } = useParamsContext();

  return (
    <MapDrawer
      open={!!params.geoapifyPlaceId}
      depth={drawerDepth.get("geoapifyPlaceId") ?? 0}
    >
      {isPending ? (
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
          <BasicSkeleton className="p-6" />
        </>
      ) : (
        <SearchDetailsInner geoapifyPlaceDetails={geoapifyPlaceDetails} />
      )}
    </MapDrawer>
  );
}

function SearchDetailsInner({ geoapifyPlaceDetails }: SearchDetailsProps) {
  const { setQueryStates } = useParamsContext();

  const longitude = geoapifyPlaceDetails?.features[0]?.properties.lon;
  const latitude = geoapifyPlaceDetails?.features[0]?.properties.lat;
  const place = geoapifyPlaceDetails?.features[0]?.properties;

  useEffect(() => {
    // no-op here; map centering is handled inside PlaceDetailsContent
  }, []);

  if (!longitude || !latitude || !place) return null;

  return (
    <>
      <PlaceDetailsContent
        latitude={latitude}
        longitude={longitude}
        place={place}
        onClose={() => {
          void setQueryStates({ geoapifyPlaceId: null });
        }}
      />
      <Marker longitude={longitude} latitude={latitude} scale={1.5} />
    </>
  );
}
