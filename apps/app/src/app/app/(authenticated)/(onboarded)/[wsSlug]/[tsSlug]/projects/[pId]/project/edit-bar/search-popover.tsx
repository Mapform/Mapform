"use client";

import type { GeoapifyPlace } from "@mapform/map-utils/types";
import { forwardRef } from "react";

import { useMapform } from "~/components/mapform";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { LocationMarker } from "~/components/location-marker";
import { Button } from "@mapform/ui/components/button";
import type { LucideIcon } from "lucide-react";

interface SearchPopoverProps {
  isPending?: boolean;
  location: mapboxgl.LngLat;
  selectedFeature: GeoapifyPlace["features"][number] | null;
  actions?: {
    onClick: () => void;
    label: string;
    icon: LucideIcon;
    variant?: React.ComponentProps<typeof Button>["variant"];
  }[];
  children?: React.ReactNode;
}

export const SearchPopover = forwardRef<HTMLDivElement, SearchPopoverProps>(
  (props, ref) => {
    const { map } = useMapform();

    if (!map) {
      return null;
    }

    return <SearchPopoverInner ref={ref} map={map} {...props} />;
  },
);

interface SearchPopoverInnerProps extends SearchPopoverProps {
  map: mapboxgl.Map;
}

export const SearchPopoverInner = forwardRef<
  HTMLDivElement,
  SearchPopoverInnerProps
>(
  (
    {
      map,
      location,
      selectedFeature,
      isPending = false,
      children,
      actions = [],
    },
    ref,
  ) => {
    return (
      <LocationMarker
        map={map}
        longitude={location.lng}
        latitude={location.lat}
      >
        <div className="relative">
          <div className="relative" ref={ref}>
            {children || <div className="size-0" />}
            <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2">
              <div className="bg-popover text-popover-foreground min-h-[50px] w-72 rounded-md border shadow-md">
                <div className="p-4" onClick={(e) => e.stopPropagation()}>
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
                      <div className="mt-2 flex gap-2">
                        {actions.map((action) => (
                          <Button
                            key={action.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick();
                            }}
                            variant={action.variant ?? "outline"}
                            size="sm"
                          >
                            <action.icon className="mr-1 size-4" />
                            {action.label}
                          </Button>
                        ))}
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
  },
);
