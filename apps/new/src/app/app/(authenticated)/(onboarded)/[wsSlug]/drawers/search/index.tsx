"use client";

import { cn } from "@mapform/lib/classnames";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import { Input } from "@mapform/ui/components/input";
import { MessageCircle, BoxIcon, GlobeIcon } from "lucide-react";
import { map } from "zod";
import { useParamsContext } from "~/lib/params/client";
import { useProject } from "../../[pId]/context";
import { MapDrawer } from "~/components/map-drawer";

export function SearchDrawer() {
  const { params, setQueryStates } = useParamsContext();
  // const { projectService, vectorSearchResults, geoapifySearchResults } = useProject();

  return (
    <MapDrawer open={params.search === "1"} depth={0}>
      <Input
        className="mb-4"
        value={params.query ?? ""}
        onChange={(e) => setQueryStates({ query: e.target.value })}
        placeholder="Search or ask..."
      />
      <Command>
        <CommandList>
          <CommandGroup className="p-0">
            {params.query && (
              <CommandItem
                onSelect={() => {
                  void setQueryStates({ chatId: "1", search: null });
                }}
              >
                <MessageCircle className="text-muted-foreground mr-2 size-4" />
                <span className="truncate">{params.query}</span>
                <span className="text-muted-foreground ml-1 flex-shrink-0">
                  — Chat
                </span>
              </CommandItem>
            )}
            {/* {vectorSearchResults?.map((result) => (
              <CommandItem
                key={result.id}
                value={result.id}
                onSelect={async () => {
                  console.log("clicked", result.id);
                  await setQueryStates({ rowId: result.id });
                  setSearchFocused(false);
                  map?.flyTo({
                    center: result.center.coordinates as [number, number],
                    duration: 500,
                  });
                }}
              >
                {projectService.optimisticState.icon ? (
                  <span className="text-muted-foreground mr-2">
                    {projectService.optimisticState.icon}
                  </span>
                ) : (
                  <BoxIcon className="text-muted-foreground mr-2 size-4" />
                )}
                <span className="truncate">{result.name}</span>
                <span className="text-muted-foreground ml-1 flex-shrink-0">
                  {" "}
                  — From {projectService.optimisticState.name ?? "your map"}
                </span>
              </CommandItem>
            ))} */}
            {/* {filteredFeatures.map((feature) => (
              <CommandItem
                key={feature.properties?.place_id}
                value={feature.properties?.place_id}
                onSelect={async () => {
                  await setQueryStates({
                    geoapifyPlaceId: feature.properties?.place_id,
                  });
                  setSearchFocused(false);
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
              </CommandItem>
            ))} */}
          </CommandGroup>
        </CommandList>
      </Command>
    </MapDrawer>
  );
}
