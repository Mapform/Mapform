"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { BasicSkeleton } from "~/components/skeletons/basic";
import { PlaceDetailsContent } from "../../components/place-details-content";
import { useEffect } from "react";
import { Marker, useMap } from "react-map-gl/mapbox";
import type { Details } from "@mapform/backend/data/stadia/details";
import { DRAWER_WIDTH, SIDEBAR_WIDTH } from "~/constants/sidebars";

interface CoordinatesProps {
  coordinates: [number, number] | null;
  details: Details["data"];
}

export function Coordinates({ coordinates, details }: CoordinatesProps) {
  const map = useMap();
  const { drawerDepth, isPending, setQueryStates, params } = useParamsContext();

  const longitude = coordinates?.[1];
  const latitude = coordinates?.[0];

  useEffect(() => {
    if (!longitude || !latitude || params.location) return;
    map.current?.easeTo({
      center: [longitude, latitude],
      padding: {
        left: SIDEBAR_WIDTH + DRAWER_WIDTH,
        top: 0,
        bottom: 0,
        right: 0,
      },
    });
  }, []);

  return (
    <MapDrawer open={!!coordinates} depth={drawerDepth.get("stadiaId") ?? 0}>
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
                void setQueryStates({ marker: null });
              }}
            >
              <XIcon className="size-4" />
            </Button>
          </MapDrawerToolbar>
          <BasicSkeleton className="p-6" />
        </>
      ) : (
        <SearchDetailsInner coordinates={coordinates} details={details} />
      )}
      {longitude && latitude && (
        <Marker longitude={longitude} latitude={latitude} scale={1.5} />
      )}
    </MapDrawer>
  );
}

function SearchDetailsInner({ coordinates, details }: CoordinatesProps) {
  const { setQueryStates } = useParamsContext();

  const longitude = coordinates?.[1]!;
  const latitude = coordinates?.[0]!;
  const feature = details?.features[0];

  return (
    <PlaceDetailsContent
      latitude={latitude}
      longitude={longitude}
      feature={feature}
      onClose={() => {
        void setQueryStates({ marker: null });
      }}
    />
  );
}
