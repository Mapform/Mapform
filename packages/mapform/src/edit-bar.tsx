import type { PlacesSearchResponse, ViewState } from "@mapform/map-utils/types";
import { Button } from "@mapform/ui/components/button";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { SearchIcon, Undo2Icon } from "lucide-react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
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
  onLocationSave?: (location: ViewState) => Promise<{ success: boolean }>;
}

type EditBarInnerProps = EditBarProps;

const queryClient = new QueryClient();

export function EditBar({
  hasMoved,
  initialViewState,
  onLocationSave,
}: EditBarProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <EditBarInner
        hasMoved={hasMoved}
        initialViewState={initialViewState}
        onLocationSave={onLocationSave}
      />
    </QueryClientProvider>
  );
}

function EditBarInner({
  hasMoved,
  initialViewState,
  onLocationSave,
}: EditBarInnerProps) {
  const { map } = useMap();
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <div className="flex items-center bg-primary rounded-lg px-2 py-0 absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
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
        <CommandSearch />
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
    </div>
  );
}

function CommandSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => fetchPlaces(debouncedQuery),
    placeholderData: (prev) => prev,
  });

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
            <CommandItem key={feature.properties.place_id}>
              <span className="truncate pr-2">
                <span className="font-medium">
                  {feature.properties.name ?? feature.properties.address_line1}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  {feature.properties.address_line2}
                </span>
              </span>
              <CommandShortcut>⌘{i + 1}</CommandShortcut>
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
