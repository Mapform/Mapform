"use client";

import { forwardRef } from "react";

import { useMapform } from "~/components/mapform";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { LocationMarker } from "~/components/location-marker";

interface SearchPopoverProps {
  isPending?: boolean;
  location: mapboxgl.LngLat;
  title?: string;
  subtitle?: string;
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

SearchPopover.displayName = "SearchPopover";

interface SearchPopoverInnerProps extends SearchPopoverProps {
  map: mapboxgl.Map;
}

export const SearchPopoverInner = forwardRef<
  HTMLDivElement,
  SearchPopoverInnerProps
>(({ map, location, title, subtitle, isPending = false, children }, ref) => {
  return (
    <LocationMarker map={map} longitude={location.lng} latitude={location.lat}>
      <div className="relative">
        <div className="relative" ref={ref}>
          <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2">
            <div className="bg-popover text-popover-foreground min-h-[50px] w-72 rounded-md border shadow-md">
              <div className="p-4" onClick={(e) => e.stopPropagation()}>
                {isPending ? (
                  <>
                    <Skeleton className="mb-2 h-8" />
                    <Skeleton className="h-4" />
                  </>
                ) : (
                  <>
                    <div className="text-lg font-semibold">{title}</div>
                    <div className="text-muted-foreground text-base">
                      {subtitle}
                    </div>
                    <div className="mt-2 flex gap-2">{children}</div>
                  </>
                )}
              </div>
              <div className="bg-popover absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </LocationMarker>
  );
});

SearchPopoverInner.displayName = "SearchPopoverInner";
