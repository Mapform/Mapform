"use client";

import type { SearchPlaces } from "@mapform/backend/data/geoapify/search";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandPrimitive,
} from "@mapform/ui/components/command";
import {
  BoxIcon,
  GlobeIcon,
  Loader2,
  MessageCircle,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { useMap } from "react-map-gl/mapbox";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { useEffect, useState } from "react";
import type { SearchRows } from "@mapform/backend/data/rows/search-rows";
import { Button } from "@mapform/ui/components/button";
import type { ListChats } from "@mapform/backend/data/chats/list-chats";

interface SearchProps {
  geoapifySearchResults?: SearchPlaces["data"];
  vectorSearchResults?: SearchRows["data"];
  previousChats?: ListChats["data"];
}

export function Search({
  geoapifySearchResults,
  vectorSearchResults,
  previousChats,
}: SearchProps) {
  const { params, drawerDepth } = useParamsContext();

  return (
    <MapDrawer open={!!params.search} depth={drawerDepth.get("search") ?? 0}>
      <SearchInner
        geoapifySearchResults={geoapifySearchResults}
        vectorSearchResults={vectorSearchResults}
        previousChats={previousChats}
      />
    </MapDrawer>
  );
}

export function SearchInner({
  geoapifySearchResults,
  vectorSearchResults,
  previousChats,
}: SearchProps) {
  const { map } = useMap();
  const { params, setQueryStates, isPending } = useParamsContext();
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
    <>
      <Command className="bg-transparent" shouldFilter={false}>
        <MapDrawerToolbar className="border-b">
          <div
            className="hover:bg-muted focus-within:ring-ring focus-within:bg-muted relative flex flex-1 items-center rounded-md pl-3 pr-1 transition-all focus-within:ring-2"
            cmdk-input-wrapper=""
          >
            {isPending && searchQuery && searchQuery.length > 0 ? (
              <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
            ) : (
              <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            )}
            <CommandPrimitive.Input
              className="placeholder:text-muted-foreground flex h-9 w-full rounded-md border-none bg-transparent px-1 py-3 text-base outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Search or ask..."
              onValueChange={setSearchQuery}
              value={searchQuery ?? ""}
              autoFocus
            />
            <Button
              className="absolute right-0 top-0"
              variant="ghost"
              size="icon"
              onClick={() => {
                void setQueryStates({ search: null, query: null });
              }}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </MapDrawerToolbar>
        <CommandList className="max-h-full p-2">
          <CommandGroup>
            {searchQuery && (
              <CommandItem
                onSelect={async () => {
                  const randomId = crypto.randomUUID();

                  await setQueryStates(
                    {
                      query: searchQuery,
                      chatId: randomId,
                    },
                    {
                      shallow: true, // So as to not trigger a refetch
                    },
                  );
                }}
              >
                <MessageCircle className="text-muted-foreground mr-2 size-4 flex-shrink-0" />
                <span className="truncate">{searchQuery}</span>
                <span className="text-muted-foreground ml-1 flex-shrink-0">
                  — Chat
                </span>
              </CommandItem>
            )}
            {vectorSearchResults?.map((result) => (
              <CommandItem
                key={result.id}
                value={result.id}
                onSelect={async () => {
                  await setQueryStates({ rowId: result.id });
                  map?.flyTo({
                    center: result.center.coordinates as [number, number],
                    duration: 500,
                  });
                }}
              >
                {result.icon ? (
                  <span className="text-muted-foreground mr-2 flex-shrink-0">
                    {result.icon}
                  </span>
                ) : (
                  <BoxIcon className="text-muted-foreground mr-2 size-4 flex-shrink-0" />
                )}
                <span className="truncate">
                  {result.name || "Unnamed feature"}
                </span>
                <span className="text-muted-foreground ml-1 flex-shrink-0">
                  {" "}
                  — From {result.projectName}
                </span>
              </CommandItem>
            ))}
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
                <GlobeIcon className="text-muted-foreground mr-2 size-4 flex-shrink-0" />
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
          {previousChats && previousChats.length > 0 && (
            <CommandGroup heading="Chats">
              {previousChats.map((chat) => (
                <CommandItem
                  key={chat.id}
                  value={chat.id}
                  onSelect={async () => {
                    await setQueryStates(
                      { chatId: chat.id },
                      { shallow: false },
                    );
                  }}
                >
                  <MessageCircle className="text-muted-foreground mr-2 size-4 flex-shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </>
  );
}
