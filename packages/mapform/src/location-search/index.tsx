"use client";

import type { GeoapifyPlace } from "@mapform/map-utils/types";
import { useEffect, useMemo, useState } from "react";
import { Marker } from "mapbox-gl";
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
import * as Portal from "@radix-ui/react-portal";
import { motion } from "motion/react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { useMapform } from "~/context";
import { Button } from "@mapform/ui/components/button";

export function LocationSearch() {
  const { map } = useMapform();

  if (!map) {
    return null;
  }

  return <LocationSearchWithMap map={map} />;
}

export function LocationSearchWithMap({ map }: { map: mapboxgl.Map }) {
  const [query, setQuery] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<
    GeoapifyPlace["features"][number] | null
  >(null);
  const [isMapMoving, setIsMapMoving] = useState(false);

  const debouncedSearchQuery = useDebounce(query, 200);

  const reverseGeocode = async ({ lat, lng }: { lat: number; lng: number }) => {
    const response = await fetch(
      `/api/places/reverse-geocode?lat=${lat}&lng=${lng}`,
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const result = json.data as GeoapifyPlace;
    const firstFeature = result.features[0];

    if (firstFeature) {
      setSelectedFeature(firstFeature);
    }

    return result;
  };

  const { data: searchResults, isFetching } = useQuery({
    enabled: !!debouncedSearchQuery,
    queryKey: ["search", debouncedSearchQuery],
    queryFn: () =>
      searchPlaces(debouncedSearchQuery, {
        bounds: map.getBounds().toArray().flat() as [
          number,
          number,
          number,
          number,
        ],
      }),
    placeholderData: (prev) => prev,
  });

  const { isFetching: isFetchingRGResults } = useQuery({
    enabled: !isMapMoving,
    queryKey: ["reverse-geocode", map.getCenter().lat, map.getCenter().lng],
    queryFn: () =>
      reverseGeocode({
        lat: map.getCenter().lat,
        lng: map.getCenter().lng,
      }),
    placeholderData: (prev) => prev,
  });

  const marker = useMemo(() => {
    const currentLocation = map.getCenter();
    const el = document.createElement("div");
    const mk = new Marker(el).setLngLat(currentLocation);

    map.on("move", () => {
      mk.setLngLat(map.getCenter());
    });

    map.on("movestart", () => {
      setIsMapMoving(true);
    });

    map.on("moveend", () => {
      setIsMapMoving(false);
    });

    return mk;
  }, [map]);

  useEffect(() => {
    marker.addTo(map);

    return () => {
      setIsMapMoving(false);
      marker.remove();
    };
  }, []);

  // Controls hot keys for selecting search results
  useEffect(() => {
    const down = (
      key: string,
      feature: GeoapifyPlace["features"][number],
      e: KeyboardEvent,
    ) => {
      if (e.key === key.toString() && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();

        if (!feature.bbox || !feature.properties) {
          return;
        }

        map
          .fitBounds(
            [
              [feature.bbox[0], feature.bbox[1]],
              [feature.bbox[2], feature.bbox[3]],
            ],
            {
              duration: 0,
            },
          )
          .setCenter([feature.properties.lon, feature.properties.lat]);
      }
    };

    searchResults?.features.forEach((feature, i) => {
      const key = i + 1;

      if (key <= 5) {
        document.addEventListener(
          "keydown",

          down.bind(null, key.toString(), feature),
        );
      }
    });

    return () => {
      searchResults?.features.forEach((feature, i) => {
        const key = i + 1;

        if (i <= 5) {
          document.removeEventListener(
            "keydown",

            down.bind(null, key.toString(), feature),
          );
        }
      });
    };
  }, [searchResults?.features, map]);

  // Only show unique features with properties and bbox
  const features =
    searchResults?.features.filter(
      (f, i, self) =>
        f.properties &&
        f.bbox &&
        i ===
          self.findIndex(
            (t) => t.properties?.place_id === f.properties?.place_id,
          ),
    ) ?? [];

  const searchResultsList = useMemo(() => {
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
                  if (!feature.bbox || !feature.properties) {
                    return;
                  }

                  map
                    .fitBounds(
                      [
                        [feature.bbox[0], feature.bbox[1]],
                        [feature.bbox[2], feature.bbox[3]],
                      ],
                      {
                        duration: 0,
                      },
                    )
                    .setCenter([
                      feature.properties.lon,
                      feature.properties.lat,
                    ]);

                  setSelectedFeature(feature);
                }}
              >
                <span className="truncate sm:pr-2">
                  <div className="text-sm font-medium">
                    {feature.properties?.name ??
                      feature.properties?.address_line1}
                  </div>
                  <span className="text-muted-foreground">
                    {feature.properties?.address_line2}
                  </span>
                </span>
                <CommandShortcut className="hidden sm:block">
                  ⌘{i + 1}
                </CommandShortcut>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    );
  }, [features, isFetching, map]);

  return (
    <>
      <Command className="flex min-h-[200px] flex-col" shouldFilter={false}>
        <CommandInput
          className="h-12 border-none focus:ring-0"
          onValueChange={(search) => {
            setQuery(search);
          }}
          placeholder="Search for places..."
          value={query}
        />
        {searchResultsList}
        <div className="mt-auto p-2">
          <Button className="w-full" disabled={!selectedFeature} type="button">
            Confirm
          </Button>
        </div>
      </Command>
      <Portal.Root container={marker.getElement()}>
        <Popover open={!isMapMoving}>
          <PopoverAnchor>
            <motion.div
              animate={{
                opacity: 1,
              }}
              className="flex -translate-y-1/2 flex-col items-center"
              key="pin"
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="z-10 size-4 rounded-full border-4 border-black bg-white" />
              <div className="-mt-1.5 h-8 w-[5px] bg-black" />
            </motion.div>
          </PopoverAnchor>
          <PopoverContent
            className={cn({ "w-[200px]": !selectedFeature })}
            sideOffset={32}
            side="top"
          >
            <div className="p-2">
              {selectedFeature ? (
                <div className="">
                  <div className="text-lg font-semibold">
                    {selectedFeature.properties?.name ??
                      selectedFeature.properties?.address_line1}
                  </div>
                  <div className="text-muted-foreground">
                    {selectedFeature.properties?.address_line2}
                  </div>
                </div>
              ) : (
                <div className="text-center">Drag map or search</div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </Portal.Root>
    </>
  );
}

async function searchPlaces(
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

  return json.data as GeoapifyPlace;
}
