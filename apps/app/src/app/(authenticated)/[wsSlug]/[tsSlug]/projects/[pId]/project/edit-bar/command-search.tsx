import { cn } from "@mapform/lib/classnames";
import { debounce } from "@mapform/lib/lodash";
import { PlacesSearchResponse } from "@mapform/map-utils/types";
import { useMap } from "@mapform/mapform";
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

export function CommandSearch({
  setOpenSearch,
  setSearchLocation,
}: {
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchLocation: React.Dispatch<
    React.SetStateAction<{
      id: string;
      latitude: number;
      longitude: number;
      name: string;
    } | null>
  >;
}) {
  const { map } = useMap();
  const [query, setQuery] = useState("");
  const debouncedSetQuery = debounce(setQuery, 250, {
    leading: true,
    trailing: true,
  });
  const { data, isFetching } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchPlaces(query),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    const down = (
      key: string,
      feature: PlacesSearchResponse["features"][number],
      e: KeyboardEvent
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
          }
        );

        setSearchLocation({
          id: feature.properties.place_id,
          latitude: feature.properties.lat,
          longitude: feature.properties.lon,
          name: feature.properties.name ?? feature.properties.address_line1,
        });
      }
    };

    data?.features.forEach((feature, i) => {
      const key = i + 1;

      if (key <= 5) {
        document.addEventListener(
          "keydown",

          down.bind(null, key.toString(), feature)
        );
      }
    });

    return () => {
      data?.features.forEach((feature, i) => {
        const key = i + 1;

        if (i <= 5) {
          document.removeEventListener(
            "keydown",

            down.bind(null, key.toString(), feature)
          );
        }
      });
    };
  }, [data?.features, map, setOpenSearch, setSearchLocation]);

  return (
    <>
      <CommandInput
        className="border-none focus:ring-0"
        onValueChange={(search) => {
          debouncedSetQuery(search);
        }}
        placeholder="Search for places..."
        value={query}
      />
      <CommandList className={cn(isFetching && "animate-pulse")}>
        <CommandEmpty className="bg-gray-100 rounded m-2 mb-0 p-8 text-center text-muted-foreground">
          {isFetching ? "Searching..." : "No results found."}
        </CommandEmpty>
        <CommandGroup>
          {data?.features.map((feature, i) => {
            if (!feature.bbox || !feature.properties) {
              return;
            }

            return (
              <CommandItem
                key={feature.properties.place_id}
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
                    }
                  );

                  setSearchLocation({
                    id: feature.properties.place_id,
                    latitude: feature.properties.lat,
                    longitude: feature.properties.lon,
                    name:
                      feature.properties.name ??
                      feature.properties.address_line1,
                  });
                }}
              >
                <span className="truncate pr-2">
                  <span className="font-medium">
                    {feature.properties.name ??
                      feature.properties.address_line1}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {feature.properties.address_line2}
                  </span>
                </span>
                <CommandShortcut>⌘{i + 1}</CommandShortcut>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </>
  );
}

async function fetchPlaces(query?: string) {
  if (!query) {
    return undefined;
  }

  const response = await fetch(`/api/places/search?query=${query}`);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();

  return json.data as PlacesSearchResponse;
}
