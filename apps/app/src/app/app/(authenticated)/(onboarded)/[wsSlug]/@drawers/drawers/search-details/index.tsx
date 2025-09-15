"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { BasicSkeleton } from "~/components/skeletons/basic";
import { PlaceDetailsContent } from "../../components/place-details-content";
import { useEffect } from "react";
import { Marker } from "react-map-gl/mapbox";
import type { Details } from "@mapform/backend/data/stadia/details";
import { MapPositioner } from "~/lib/map/map-positioner";

interface SearchDetailsProps {
  details: Details["data"];
}

export function SearchDetails({ details }: SearchDetailsProps) {
  const { params, drawerDepth, isPending, setQueryStates } = useParamsContext();

  const longitude = details?.features[0]?.geometry?.coordinates[0];
  const latitude = details?.features[0]?.geometry?.coordinates[1];

  return (
    <MapDrawer
      open={!!params.stadiaId}
      depth={drawerDepth.get("stadiaId") ?? 0}
    >
      <MapPositioner
        viewState={{
          ...(longitude && latitude && { center: [longitude, latitude] }),
        }}
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
                  void setQueryStates({ stadiaId: null });
                }}
              >
                <XIcon className="size-4" />
              </Button>
            </MapDrawerToolbar>
            <BasicSkeleton className="p-6" />
          </>
        ) : (
          <SearchDetailsInner details={details} />
        )}
      </MapPositioner>
    </MapDrawer>
  );
}

function SearchDetailsInner({ details }: SearchDetailsProps) {
  const { setQueryStates } = useParamsContext();

  const longitude = details?.features[0]?.geometry?.coordinates[0];
  const latitude = details?.features[0]?.geometry?.coordinates[1];
  const feature = details?.features[0];

  useEffect(() => {
    // no-op here; map centering is handled inside PlaceDetailsContent
  }, []);

  if (!longitude || !latitude || !feature)
    return (
      <>
        <MapDrawerToolbar>
          <Button
            className="ml-auto"
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={() => {
              void setQueryStates({ stadiaId: null });
            }}
          >
            <XIcon className="size-4" />
          </Button>
        </MapDrawerToolbar>
        <div className="flex flex-1 flex-col justify-center rounded-lg bg-gray-50 p-8">
          <div className="text-center">
            <h3 className="text-foreground mt-2 text-sm font-medium">
              No feature found
            </h3>
          </div>
        </div>
      </>
    );

  return (
    <>
      <PlaceDetailsContent
        latitude={latitude}
        longitude={longitude}
        feature={feature}
        onClose={() => {
          void setQueryStates({ stadiaId: null });
        }}
      />
      <Marker longitude={longitude} latitude={latitude} scale={1.5} />
    </>
  );
}
