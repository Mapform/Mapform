"use client";

import type { GeoapifyPlace } from "@mapform/map-utils/types";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Marker } from "mapbox-gl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { useMapform } from "~/components/mapform";
import { Button, type ButtonProps } from "@mapform/ui/components/button";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { SelectionPin } from "../selection-pin";
import { useReverseGeocode } from "~/hooks/use-reverse-geocode";
import { motion, AnimatePresence } from "motion/react";

interface LocationSearchProps {
  children?: React.ReactNode;
  disableDragSearch?: boolean;
}

export function LocationSearch(props: LocationSearchProps) {
  const { map } = useMapform();

  if (!map) {
    return null;
  }

  return <LocationSearchWithMap map={map} {...props} />;
}

export interface LocationSearchContextProps {
  selectedFeature: GeoapifyPlace["features"][number] | null;
  isFetching: boolean;
  isMoving: boolean;
}

export const LocationSearchContext = createContext<LocationSearchContextProps>(
  {} as LocationSearchContextProps,
);
export const useLocationSearch = () => useContext(LocationSearchContext);

interface LocationSearchWithMapProps extends LocationSearchProps {
  map: mapboxgl.Map;
}

export function LocationSearchWithMap({
  map,
  children,
  disableDragSearch = false,
}: LocationSearchWithMapProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();
  const [selectedFeatureFromSearch, setSelectedFeatureFromSearch] = useState<
    GeoapifyPlace["features"][number] | null
  >(null);
  const [isMoving, setIsMoving] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: map.getCenter().lat,
    lng: map.getCenter().lng,
  });
  const [showPinPopover, setShowPinPopover] = useState(!disableDragSearch);
  const debouncedSearchQuery = useDebounce(query, 200);

  const {
    isFetching: isFetchingRGResults,
    selectedFeature: selectedFeatureFromDrag,
  } = useReverseGeocode({
    lat: Number(coordinates.lat.toFixed(10)),
    lng: Number(coordinates.lng.toFixed(10)),
    retry: 0,
    enabled: !disableDragSearch,
  });

  const selectedFeature = selectedFeatureFromSearch || selectedFeatureFromDrag;

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

  const marker = useMemo(() => {
    const currentLocation = map.getCenter();
    const el = document.createElement("div");
    el.style.zIndex = "20";
    const mk = new Marker(el).setLngLat(currentLocation);

    return mk;
  }, [map]);

  useEffect(() => {
    marker.addTo(map);
    // Fetch on mount
    setCoordinates({
      lat: map.getCenter().lat,
      lng: map.getCenter().lng,
    });

    // Focus on input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const handleMove = () => {
      marker.setLngLat(map.getCenter());
      setIsMoving(true);
    };

    const handleMoveStart = () => {
      setShowPinPopover(false);
      setSelectedFeatureFromSearch(null);
      setIsMoving(true);
    };

    const handleMoveEnd = () => {
      const lat = map.getCenter().lat;
      const lng = map.getCenter().lng;
      const queryKey = ["reverse-geocode", lat, lng];

      console.log(queryClient.getQueryData(queryKey));

      // Only refetch if we don't have cached data for these coordinates and drag search is enabled
      if (!queryClient.getQueryData(queryKey) && !disableDragSearch) {
        setCoordinates({
          lat: map.getCenter().lat,
          lng: map.getCenter().lng,
        });
      }
      setShowPinPopover(!disableDragSearch);
      setIsMoving(false);
    };

    map.on("move", handleMove);
    map.on("movestart", handleMoveStart);
    map.on("moveend", handleMoveEnd);

    return () => {
      setShowPinPopover(!disableDragSearch);
      marker.remove();
      map.off("move", handleMove);
      map.off("movestart", handleMoveStart);
      map.off("moveend", handleMoveEnd);
    };
  }, [disableDragSearch]);

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

        setSelectedFeatureFromSearch(feature);

        setTimeout(() => {
          inputRef.current?.blur();
        }, 0);
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
      <CommandList
        className={cn(
          "md:absolute md:left-2 md:right-2 md:mt-2 md:w-[calc(100%-1rem)] md:rounded-lg md:border md:bg-white md:shadow-md",
          isFetching && "animate-pulse",
        )}
      >
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
                onClick={(e) => {
                  e.preventDefault();
                }}
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

                  setSelectedFeatureFromSearch(feature);

                  setTimeout(() => {
                    inputRef.current?.blur();
                  }, 0);
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
      <Command className="flex flex-1 flex-col" shouldFilter={false}>
        <div className="group" onClick={() => inputRef.current?.focus()}>
          <div className="relative">
            <CommandInput
              className="peer h-12 border-none focus:ring-0"
              onValueChange={(search) => {
                setQuery(search);
              }}
              placeholder="Search for places..."
              ref={inputRef}
              value={query}
            />
            <div
              className={cn(
                "absolute right-10 top-0 flex h-full flex-col justify-center transition-opacity",
                {
                  "pointer-events-none opacity-0": !query,
                },
              )}
            >
              <Button
                className="hover:bg-accent bg-white"
                onClick={() => {
                  queryClient.removeQueries({
                    queryKey: ["search", query],
                  });
                  setQuery("");
                }}
                size="sm"
                variant="ghost"
                type="button"
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="hidden group-focus-within:block">
            {query.length ? searchResultsList : null}
          </div>
        </div>
      </Command>
      <Portal.Root container={marker.getElement()}>
        <Popover open={showPinPopover || !!selectedFeatureFromSearch}>
          <PopoverAnchor>
            <AnimatePresence>
              {(showPinPopover || !!selectedFeatureFromSearch) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SelectionPin />
                </motion.div>
              )}
            </AnimatePresence>
          </PopoverAnchor>
          <PopoverContent
            className={cn({
              "w-[200px]": !selectedFeature && !isFetchingRGResults,
            })}
            sideOffset={32}
            side="top"
          >
            <div className="p-2">
              {isFetchingRGResults ? (
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
                  <div className="text-muted-foreground">
                    {selectedFeature.properties?.address_line2}
                  </div>
                  <LocationSearchContext.Provider
                    value={{
                      selectedFeature,
                      isFetching: isFetching || isFetchingRGResults,
                      isMoving,
                    }}
                  >
                    <div className="mt-2">{children}</div>
                  </LocationSearchContext.Provider>
                </>
              ) : null}
            </div>
          </PopoverContent>
        </Popover>
      </Portal.Root>
    </>
  );
}

export function LocationSearchButton(
  props: Omit<ButtonProps, "onClick" | "disabled" | "className"> & {
    disabled?: boolean;
    className?: string;
    onClick?: (
      selectedFeature: GeoapifyPlace["features"][number] | null,
    ) => void;
  },
) {
  const { selectedFeature, isFetching, isMoving } = useLocationSearch();

  return (
    <Button
      {...props}
      className={cn(props.className, "w-full")}
      disabled={props.disabled || !selectedFeature || isFetching || isMoving}
      type="button"
      onClick={() => props.onClick?.(selectedFeature)}
    />
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
