"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { BasicSkeleton } from "~/components/skeletons/basic";
import { PlaceDetailsContent } from "../../components/place-details-content";
import { Marker } from "react-map-gl/maplibre";
import type { ReverseGeocode } from "@mapform/backend/data/stadia/reverse";
import { MapPositioner } from "~/lib/map/map-positioner";

interface CoordinatesProps {
  coordinates: [number, number] | null;
  details: ReverseGeocode | null;
}

export function CoordinatesWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { params, drawerDepth } = useParamsContext();
  return (
    <MapDrawer open={!!params.marker} depth={drawerDepth.get("marker") ?? 0}>
      {children}
    </MapDrawer>
  );
}

export function CoordinatesEmpty() {
  const { setQueryStates } = useParamsContext();
  return (
    <>
      <MapDrawerToolbar>
        <Button
          className="ml-auto"
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={() => {
            void setQueryStates({ marker: null });
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </MapDrawerToolbar>
      <div className="flex flex-1 flex-col justify-center rounded-lg bg-gray-50 p-8">
        <div className="text-center">
          <h3 className="text-foreground mt-2 text-sm font-medium">
            No location found
          </h3>
        </div>
      </div>
    </>
  );
}

export function Coordinates({ coordinates, details }: CoordinatesProps) {
  const { setQueryStates } = useParamsContext();

  const longitude = coordinates?.[1];
  const latitude = coordinates?.[0];

  return (
    <>
      <MapPositioner
        viewState={{
          ...(longitude && latitude && { center: [longitude, latitude] }),
        }}
      >
        {coordinates && details ? (
          <SearchDetailsInner coordinates={coordinates} details={details} />
        ) : (
          <>
            <MapDrawerToolbar>
              <Button
                className="ml-auto"
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={() => {
                  void setQueryStates({ marker: null });
                }}
              >
                <XIcon className="size-4" />
              </Button>
            </MapDrawerToolbar>
            <BasicSkeleton className="p-6" />
          </>
        )}
      </MapPositioner>
      {longitude && latitude && (
        <Marker longitude={longitude} latitude={latitude} scale={1.5} />
      )}
    </>
  );
}

function SearchDetailsInner({ coordinates, details }: CoordinatesProps) {
  const { setQueryStates } = useParamsContext();
  if (!coordinates) return null;
  const [latitude, longitude] = coordinates;
  const feature = details?.data?.features[0];

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
