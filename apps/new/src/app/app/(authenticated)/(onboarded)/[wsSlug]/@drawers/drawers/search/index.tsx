"use client";

import type { SearchPlaces } from "@mapform/backend/data/geoapify/search";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandPrimitive,
} from "@mapform/ui/components/command";
import { GlobeIcon, MessageCircle, SearchIcon } from "lucide-react";
import { MapDrawer } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { useMap } from "react-map-gl/mapbox";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { useEffect, useState } from "react";

interface SearchProps {
  geoapifySearchResults?: SearchPlaces["data"];
}

export function Search({ geoapifySearchResults }: SearchProps) {
  const { map } = useMap();
  const { params, setQueryStates } = useParamsContext();
  const [searchQuery, setSearchQuery] = useState(params.query);
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const filteredFeatures =
    geoapifySearchResults?.features.filter(
      (f, i, self) =>
        f.properties &&
        f.bbox &&
        i ===
          self.findIndex(
            (t) => t.properties?.place_id === f.properties?.place_id,
          ),
    ) ?? [];

  useEffect(() => {
    void setQueryStates({ query: debouncedSearchQuery });
  }, [debouncedSearchQuery, setQueryStates]);

  return (
    <MapDrawer
      open={!!params.search}
      depth={0}
      onClose={() => {
        void setQueryStates({
          search: null,
        });
      }}
    >
      <Command shouldFilter={false}>
        <div
          className="flex items-center border-b pl-3 pr-1"
          cmdk-input-wrapper=""
        >
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandPrimitive.Input
            className="placeholder:text-muted-foreground flex h-10 w-full rounded-md border-none bg-transparent px-1 py-3 text-base outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            placeholder="Search or ask..."
            onValueChange={setSearchQuery}
            value={searchQuery ?? ""}
          />
        </div>
        <CommandList className="">
          <CommandGroup>
            {searchQuery && (
              <CommandItem
                onSelect={() => {
                  void setQueryStates({
                    chatId: "123",
                  });
                }}
              >
                <MessageCircle className="text-muted-foreground mr-2 size-4" />
                <span className="truncate">{searchQuery}</span>
                <span className="text-muted-foreground ml-1 flex-shrink-0">
                  — Chat
                </span>
              </CommandItem>
            )}
            {filteredFeatures.map((feature) => (
              <CommandItem
                key={feature.properties?.place_id}
                value={feature.properties?.place_id}
                onSelect={async () => {
                  await setQueryStates({
                    geoapifyPlaceId: feature.properties?.place_id,
                  });
                  if (feature.properties?.lon && feature.properties.lat) {
                    map?.flyTo({
                      center: [feature.properties.lon, feature.properties.lat],
                      duration: 500,
                    });
                  }
                }}
              >
                <GlobeIcon className="text-muted-foreground mr-2 size-4" />
                <span className="truncate">
                  {feature.properties?.name ??
                    feature.properties?.address_line1}
                </span>
                {/* <span className="text-muted-foreground ml-1 flex-shrink-0">
                    — From {feature.properties?.country}
                  </span> */}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </MapDrawer>
  );
}
