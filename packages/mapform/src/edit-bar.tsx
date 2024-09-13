import type { PlacesSearchResponse, ViewState } from "@mapform/map-utils/types";
import { Button } from "@mapform/ui/components/button";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { SearchIcon, Undo2Icon } from "lucide-react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  CommandEmpty,
  CommandShortcut,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
} from "@mapform/ui/components/command";
import { useMap } from "./map";

interface EditBarProps {
  hasMoved: boolean;
  initialViewState: ViewState;
  setSearchLocation: React.Dispatch<
    React.SetStateAction<{
      id: string;
      latitude: number;
      longitude: number;
      name: string;
    } | null>
  >;
  onLocationSave?: (location: ViewState) => Promise<{ success: boolean }>;
}

type EditBarInnerProps = EditBarProps;

const queryClient = new QueryClient();

export function EditBar({
  hasMoved,
  initialViewState,
  onLocationSave,
  setSearchLocation,
}: EditBarProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <EditBarInner
        hasMoved={hasMoved}
        initialViewState={initialViewState}
        onLocationSave={onLocationSave}
        setSearchLocation={setSearchLocation}
      />
    </QueryClientProvider>
  );
}

function EditBarInner({
  hasMoved,
  initialViewState,
  onLocationSave,
  setSearchLocation,
}: EditBarInnerProps) {
  const { map } = useMap();
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpenSearch(true);
        }}
        size="icon-sm"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
      <CommandDialog
        onOpenChange={setOpenSearch}
        open={openSearch}
        shouldFilter={false}
      >
        <CommandSearch
          setOpenSearch={setOpenSearch}
          setSearchLocation={setSearchLocation}
        />
      </CommandDialog>

      <Button
        disabled={!hasMoved}
        onClick={() => {
          map?.setCenter([
            initialViewState.longitude,
            initialViewState.latitude,
          ]);
          map?.setZoom(initialViewState.zoom);
          map?.setPitch(initialViewState.pitch);
          map?.setBearing(initialViewState.bearing);
        }}
        size="icon-sm"
      >
        <Undo2Icon className="w-4 h-4" />
      </Button>
      <Button
        disabled={!hasMoved}
        onClick={async () => {
          const center = map?.getCenter();
          const zoom = map?.getZoom();
          const pitch = map?.getPitch();
          const bearing = map?.getBearing();

          if (
            onLocationSave &&
            center !== undefined &&
            zoom !== undefined &&
            pitch !== undefined &&
            bearing !== undefined
          ) {
            await onLocationSave({
              latitude: center.lat,
              longitude: center.lng,
              zoom,
              pitch,
              bearing,
              padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              },
            });
          }
        }}
        size="sm"
      >
        Save
      </Button>
    </>
  );
}

function CommandSearch({
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
  const debouncedQuery = useDebounce(query, 250);
  const { data } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => fetchPlaces(debouncedQuery),
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
      if (i < 9) {
        const key = i.toString();
        document.addEventListener(
          "keydown",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Safe
          down.bind(null, key, feature)
        );
      }
    });

    return () => {
      data?.features.forEach((feature, i) => {
        if (i < 9) {
          const key = i.toString();
          document.removeEventListener(
            "keydown",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Safe
            down.bind(null, key, feature)
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
          setQuery(search);
        }}
        placeholder="Search for places..."
        value={query}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {data?.features.map((feature, i) => (
            <CommandItem
              key={feature.properties.place_id}
              onSelect={() => {
                setOpenSearch(false);

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
                    feature.properties.name ?? feature.properties.address_line1,
                });
              }}
            >
              <span className="truncate pr-2">
                <span className="font-medium">
                  {feature.properties.name ?? feature.properties.address_line1}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  {feature.properties.address_line2}
                </span>
              </span>
              <CommandShortcut>⌘{i}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </>
  );
}

async function fetchPlaces(query?: string) {
  if (!query || query.length < 3) {
    return undefined;
  }

  const response = await fetch(`/api/places/search?query=${query}`);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();

  return json.data as PlacesSearchResponse;
}
