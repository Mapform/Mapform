"use client";

import { forwardRef, useEffect, useState } from "react";

import { useMapform } from "~/components/mapform";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { LocationMarker } from "~/components/location-marker";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@mapform/ui/components/popover";

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
  const { visibleMapContainer } = useMapform();
  const [isInBounds, setIsInBounds] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMoveStart = () => {
      setIsDragging(true);
    };

    const handleMoveEnd = () => {
      setIsDragging(false);
      setIsInBounds(map.getBounds().contains(location));
    };

    map.on("move", handleMoveStart);
    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("move", handleMoveStart);
      map.off("moveend", handleMoveEnd);
    };
  }, [location, map]);

  return (
    <Popover open={isInBounds && !isDragging}>
      <LocationMarker
        map={map}
        longitude={location.lng}
        latitude={location.lat}
      >
        <PopoverAnchor>
          <div className="invisible size-0.5" />
        </PopoverAnchor>
      </LocationMarker>
      <PopoverContent
        collisionBoundary={visibleMapContainer.current}
        side="top"
        align="center"
      >
        <div ref={ref}>
          {isPending ? (
            <>
              <Skeleton className="mb-2 h-8" />
              <Skeleton className="h-4" />
            </>
          ) : (
            <>
              <div className="text-lg font-semibold">{title}</div>
              <div className="text-muted-foreground text-base">{subtitle}</div>
              <div className="mt-2 flex gap-2">{children}</div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});

SearchPopoverInner.displayName = "SearchPopoverInner";
