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

interface CoordinatesProps {
  coordinates: [number, number] | null;
  geoapifyPlaceDetails: GetPlaceDetails["data"];
}

export function Coordinates({
  coordinates,
  geoapifyPlaceDetails,
}: CoordinatesProps) {
  const { drawerDepth, isPending, setQueryStates } = useParamsContext();

  const longitude = coordinates?.[1];
  const latitude = coordinates?.[0];

  return (
    <MapDrawer
      open={!!coordinates}
      depth={drawerDepth.get("geoapifyPlaceId") ?? 0}
      unmountOnClose
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
                console.log("clicked");
                void setQueryStates({ latitude: null, longitude: null });
              }}
            >
              <XIcon className="size-4" />
            </Button>
          </MapDrawerToolbar>
          <BasicSkeleton className="p-6" />
        </>
      ) : (
        <SearchDetailsInner
          coordinates={coordinates}
          geoapifyPlaceDetails={geoapifyPlaceDetails}
        />
      )}
      {longitude && latitude && (
        <Marker longitude={longitude} latitude={latitude} scale={1.5} />
      )}
    </MapDrawer>
  );
}

function SearchDetailsInner({
  coordinates,
  geoapifyPlaceDetails,
}: CoordinatesProps) {
  const { setQueryStates } = useParamsContext();

  const longitude = coordinates?.[1]!;
  const latitude = coordinates?.[0]!;
  const place = geoapifyPlaceDetails?.features[0]?.properties;

  useEffect(() => {
    // no-op here; map centering is handled inside PlaceDetailsContent
  }, []);

  return (
    <PlaceDetailsContent
      latitude={latitude}
      longitude={longitude}
      place={place}
      onClose={() => {
        void setQueryStates({ latitude: null, longitude: null });
      }}
    />
  );
}
