import { cn } from "@mapform/lib/classnames";
import { debounce } from "@mapform/lib/lodash";
import { useMapform } from "@mapform/mapform";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@mapform/ui/components/command";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type {
  SearchFeature,
  PlacesSearchResponse,
} from "@mapform/map-utils/types";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { useProject } from "../../project-context";

interface CommandSearchProps {
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchLocation: React.Dispatch<SearchFeature | null>;
}

export function CommandSearch({
  setOpenSearch,
  setSearchLocation,
}: CommandSearchProps) {
  const [query, setQuery] = useState("");

  return (
    <>
      <CommandInput
        className="border-none focus:ring-0"
        onValueChange={(search) => {
          setQuery(search);
        }}
        placeholder="Search for places..."
        value={query}
      />
      <SearchResults
        query={query}
        setOpenSearch={setOpenSearch}
        setSearchLocation={setSearchLocation}
      />
    </>
  );
}

interface SearchResultsProps {
  query: string;
  setSearchLocation: CommandSearchProps["setSearchLocation"];
  setOpenSearch: CommandSearchProps["setOpenSearch"];
}

function SearchResults({
  query,
  setSearchLocation,
  setOpenSearch,
}: SearchResultsProps) {
  const { map, setDrawerOpen } = useMapform();
  const debouncedSearchQuery = useDebounce(query, 200);

  const enabled = !!debouncedSearchQuery;

  const { data, isFetching } = useQuery({
    enabled,
    queryKey: ["search", debouncedSearchQuery],
    queryFn: () =>
      fetchPlaces(debouncedSearchQuery, {
        bounds: map?.getBounds().toArray().flat() as [
          number,
          number,
          number,
          number,
        ],
      }),
    placeholderData: (prev) => prev,
  });

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

        setOpenSearch(false);
        map?.fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          {
            duration: 0,
          },
        );

        setDrawerOpen(false);
        setSearchLocation({
          title: feature.properties.name ?? feature.properties.address_line1,
          latitude: feature.properties.lat,
          longitude: feature.properties.lon,
          icon: "unknown",
        });
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
  }, [data?.features, map, setOpenSearch, setSearchLocation, setDrawerOpen]);

  if (!enabled) return null;

  const features = data?.features ?? [];

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
        {data?.features
          .filter(
            (f, i, self) =>
              f.properties &&
              f.bbox &&
              i ===
                self.findIndex(
                  (t) => t.properties?.place_id === f.properties?.place_id,
                ),
          )
          .map((feature, i) => {
            return (
              <CommandItem
                key={feature.properties?.place_id}
                onSelect={() => {
                  setOpenSearch(false);

                  if (!feature.bbox || !feature.properties) {
                    return;
                  }

                  map?.fitBounds(
                    [
                      [feature.bbox[0], feature.bbox[1]],
                      [feature.bbox[2], feature.bbox[3]],
                    ],
                    {
                      duration: 0,
                    },
                  );

                  setDrawerOpen(false);
                  setSearchLocation({
                    title:
                      feature.properties.name ??
                      feature.properties.address_line1,
                    latitude: feature.properties.lat,
                    longitude: feature.properties.lon,
                    icon: "unknown",
                  });
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
