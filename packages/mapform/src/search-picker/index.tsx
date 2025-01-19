"use client";

import type { PlacesSearchResponse } from "@mapform/map-utils/types";
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { cn } from "@mapform/lib/classnames";
import {
  CommandList,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandInput,
  Command,
} from "@mapform/ui/components/command";
import { Drawer } from "~/drawer";
import { Button } from "@mapform/ui/components/button";
import * as Portal from "@radix-ui/react-portal";
import { LocationMarker } from "~/map";

export type MBMap = mapboxgl.Map;

interface SearchPickerProps {
  map: MBMap;
  open: boolean;
  onClose: () => void;
  onOpenPinPicker?: () => void;
}

export function SearchPicker({
  map,
  open,
  onClose,
  onOpenPinPicker,
}: SearchPickerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      className="max-md:fixed max-md:top-0 max-md:h-screen max-md:rounded-none"
    >
      <LocationSearch map={map} onOpenPinPicker={onOpenPinPicker} />
    </Drawer>
  );
}

export function LocationSearch({
  map,
  onOpenPinPicker,
}: {
  map: MBMap;
  onOpenPinPicker?: () => void;
}) {
  const [query, setQuery] = useState("");
  const markerEl = useRef<mapboxgl.Marker | null>(null);
  const markerElInner = useRef<HTMLDivElement>(document.createElement("div"));

  const debouncedSearchQuery = useDebounce(query, 200);

  const enabled = !!debouncedSearchQuery;

  const { data, isFetching } = useQuery({
    enabled,
    queryKey: ["search", debouncedSearchQuery],
    queryFn: () =>
      fetchPlaces(debouncedSearchQuery, {
        bounds: map.getBounds().toArray().flat() as [
          number,
          number,
          number,
          number,
        ],
      }),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    const currentLocation = map.getCenter();
    // const marker = new mapboxgl.Marker().setLngLat([0, 0]).addTo(map);
    markerEl.current = new mapboxgl.Marker(markerElInner.current)
      .setLngLat([currentLocation.lng, currentLocation.lat])
      .addTo(map);

    map.on("move", () => {
      console.log(`Current Map Center: ${map.getCenter()}`);
      markerEl.current?.setLngLat(map.getCenter());
    });
  }, [map]);

  // Controls hot keys for selecting search results
  useEffect(() => {
    const down = (
      key: string,
      feature: PlacesSearchResponse["features"][number],
      e: KeyboardEvent,
    ) => {
      if (e.key === key.toString() && (e.metaKey || e.ctrlKey)) {
        const bbox = feature.bbox;

        if (!bbox || !feature.properties) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        map.fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          {
            duration: 0,
          },
        );

        // setSearchLocation({
        //   title: feature.properties.name ?? feature.properties.address_line1,
        //   latitude: feature.properties.lat,
        //   longitude: feature.properties.lon,
        //   icon: "unknown",
        // });
      }
    };

    data?.features.forEach((feature, i) => {
      const key = i + 1;

      if (key <= 5) {
        document.addEventListener(
          "keydown",

          down.bind(null, key.toString(), feature),
        );
      }
    });

    return () => {
      data?.features.forEach((feature, i) => {
        const key = i + 1;

        if (i <= 5) {
          document.removeEventListener(
            "keydown",

            down.bind(null, key.toString(), feature),
          );
        }
      });
    };
  }, [data?.features, map]);

  // Only show unique features with properties and bbox
  const features =
    data?.features.filter(
      (f, i, self) =>
        f.properties &&
        f.bbox &&
        i ===
          self.findIndex(
            (t) => t.properties?.place_id === f.properties?.place_id,
          ),
    ) ?? [];

  const searchResultsList = useMemo(() => {
    if (!enabled) return null;

    return (
      <CommandList className={cn(isFetching && "animate-pulse")}>
        {isFetching && features.length === 0 && (
          <div className="text-muted-foreground m-2 rounded bg-gray-100 px-2 py-3 text-center text-sm">
            Searching...
          </div>
        )}
        {features.length === 0 && !isFetching && (
          <div className="text-muted-foreground m-2 rounded bg-gray-100 px-2 py-3 text-center text-sm">
            No results found.
          </div>
        )}
        <CommandGroup
          className={cn("p-2", {
            "p-0": features.length === 0,
          })}
        >
          {features.map((feature, i) => {
            return (
              <CommandItem
                key={feature.properties?.place_id}
                onSelect={() => {
                  // setOpenSearch(false);

                  if (!feature.bbox || !feature.properties) {
                    return;
                  }

                  map.fitBounds(
                    [
                      [feature.bbox[0], feature.bbox[1]],
                      [feature.bbox[2], feature.bbox[3]],
                    ],
                    {
                      duration: 0,
                    },
                  );

                  // setSearchLocation({
                  //   title:
                  //     feature.properties.name ?? feature.properties.address_line1,
                  //   latitude: feature.properties.lat,
                  //   longitude: feature.properties.lon,
                  //   icon: "unknown",
                  // });
                }}
              >
                <span className="truncate pr-2">
                  <span className="font-medium">
                    {feature.properties?.name ??
                      feature.properties?.address_line1}
                  </span>
                  <span className="text-muted-foreground ml-2 text-sm">
                    {feature.properties?.address_line2}
                  </span>
                </span>
                <CommandShortcut>⌘{i + 1}</CommandShortcut>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    );
  }, [enabled, features, isFetching, map]);

  return (
    <>
      <Command shouldFilter={false}>
        <CommandInput
          className="h-12 border-none focus:ring-0"
          onValueChange={(search) => {
            setQuery(search);
          }}
          placeholder="Search for places..."
          value={query}
        />
        <Button
          onClick={onOpenPinPicker ? () => onOpenPinPicker() : undefined}
          type="button"
        >
          Select on map
        </Button>
        {searchResultsList}
      </Command>
      <Portal.Root container={markerElInner.current}>
        <div className="flex -translate-y-1/2 flex-col items-center">
          <div className="z-10 size-4 rounded-full border-4 border-black bg-white" />
          <div className="-mt-1.5 h-8 w-[5px] bg-black" />
        </div>
      </Portal.Root>
    </>
  );
}

async function fetchPlaces(
  query?: string,
  { bounds }: { bounds?: [number, number, number, number] } = {},
) {
  if (!query) {
    return undefined;
  }

  const response = await fetch(
    `/api/places/search?query=${query}&bounds=${bounds?.join(",")}`,
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();

  return json.data as PlacesSearchResponse;
}
