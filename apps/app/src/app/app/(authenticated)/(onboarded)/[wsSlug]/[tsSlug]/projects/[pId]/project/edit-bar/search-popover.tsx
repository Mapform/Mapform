"use client";

import type { GeoapifyPlace } from "@mapform/map-utils/types";

import { useMapform } from "~/components/mapform";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { LocationMarker } from "~/components/location-marker";

interface SearchPopoverProps {
  isPending?: boolean;
  location: mapboxgl.LngLat;
  selectedFeature: GeoapifyPlace["features"][number] | null;
  children?: React.ReactNode;
}

export function SearchPopover(props: SearchPopoverProps) {
  const { map } = useMapform();

  if (!map) {
    return null;
  }

  return <SearchPopoverInner map={map} {...props} />;
}

interface SearchPopoverInnerProps extends SearchPopoverProps {
  map: mapboxgl.Map;
}

export function SearchPopoverInner({
  map,
  location,
  selectedFeature,
  isPending = false,
  children,
}: SearchPopoverInnerProps) {
  return (
    <LocationMarker map={map} longitude={location.lng} latitude={location.lat}>
      <div className="relative">
        <div className="relative">
          {children || <div className="size-0" />}
          <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2">
            <div className="bg-popover text-popover-foreground min-h-[50px] w-72 rounded-md border shadow-md">
              <div className="p-4">
                {isPending ? (
                  <>
                    <Skeleton className="mb-2 h-8" />
                    <Skeleton className="h-4" />
                  </>
                ) : selectedFeature ? (
                  <>
                    <div className="text-lg font-semibold">
                      {selectedFeature.properties?.name ??
                        selectedFeature.properties?.address_line1}
                    </div>
                    <div className="text-muted-foreground text-base">
                      {selectedFeature.properties?.address_line2}
                    </div>
                  </>
                ) : (
                  <div className="text-center">{/* placeholder text */}</div>
                )}
              </div>
              <div className="bg-popover absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </LocationMarker>
  );
}
