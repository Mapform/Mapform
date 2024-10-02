import type { PlacesSearchResponse, ViewState } from "@mapform/map-utils/types";
import { Button } from "@mapform/ui/components/button";
import { debounce } from "@mapform/lib/lodash";
import { EditIcon, SaveIcon, SearchIcon, Undo2Icon } from "lucide-react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandShortcut,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
} from "@mapform/ui/components/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useMap } from "@mapform/mapform";
import { cn } from "@mapform/lib/classnames";
import { CustomBlock } from "@mapform/blocknote";
import type { PageWithLayers } from "~/data/pages/get-page-with-layers";
import { usePage } from "../page-context";
import { toast } from "@mapform/ui/components/toaster";

interface EditBarProps {
  updatePageServer: (args: {
    content?: { content: CustomBlock[] };
    title?: string;
    zoom?: number;
    pitch?: number;
    bearing?: number;
    center?: { x: number; y: number };
  }) => Promise<void>;
}

type EditBarInnerProps = EditBarProps & {
  optimisticPage: PageWithLayers;
};

const queryClient = new QueryClient();

export function EditBar({ updatePageServer }: EditBarProps) {
  const { optimisticPage } = usePage();

  if (!optimisticPage) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <EditBarInner
        optimisticPage={optimisticPage}
        updatePageServer={updatePageServer}
      />
    </QueryClientProvider>
  );
}

function EditBarInner({ optimisticPage, updatePageServer }: EditBarInnerProps) {
  const { map } = useMap();
  const [openEditor, setOpenEditor] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const { updatePage } = usePage();

  const [movedCoords, setMovedCoords] = useState<{
    lat: number;
    lng: number;
    zoom: number;
    pitch: number;
    bearing: number;
  }>({
    lat: optimisticPage.center.y,
    lng: optimisticPage.center.x,
    zoom: optimisticPage.zoom,
    pitch: optimisticPage.pitch,
    bearing: optimisticPage.bearing,
  });
  const [searchLocation, setSearchLocation] = useState<{
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    description?: {
      content: CustomBlock[];
    };
  } | null>(null);

  // Update movedCoords when the step changes
  useEffect(() => {
    setMovedCoords({
      lat: optimisticPage.center.y,
      lng: optimisticPage.center.x,
      zoom: optimisticPage.zoom,
      pitch: optimisticPage.pitch,
      bearing: optimisticPage.bearing,
    });
  }, [optimisticPage]);

  // useEffect(() => {
  //   if (map) {
  //     map.on("moveend", handleOnMove);

  //     return () => {
  //       map.off("moveend", handleOnMove);
  //     };
  //   }
  // }, [map, optimisticPage]);

  const roundLocation = (num: number) => Math.round(num * 1000000) / 1000000;

  const hasMoved =
    roundLocation(movedCoords.lat) !== roundLocation(optimisticPage.center.y) ||
    roundLocation(movedCoords.lng) !== roundLocation(optimisticPage.center.x) ||
    movedCoords.zoom !== optimisticPage.zoom ||
    movedCoords.pitch !== optimisticPage.pitch ||
    movedCoords.bearing !== optimisticPage.bearing;

  if (!openEditor) {
    return (
      <Button
        onClick={() => {
          setOpenEditor(true);
        }}
        size="sm"
      >
        <EditIcon className="size-4 mr-2 -ml-1" /> Edit Map
      </Button>
    );
  }

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                setOpenSearch(true);
              }}
              size="icon-sm"
            >
              <SearchIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search Locations</TooltipContent>
        </Tooltip>
        <CommandDialog
          onOpenChange={setOpenSearch}
          open={openSearch}
          shouldFilter={false}
          dialogContentClassName="-translate-y-[150px]"
        >
          <CommandSearch
            setOpenSearch={setOpenSearch}
            setSearchLocation={setSearchLocation}
          />
        </CommandDialog>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!hasMoved}
              onClick={() => {
                map?.setCenter([
                  optimisticPage.center.x,
                  optimisticPage.center.y,
                ]);
                map?.setZoom(optimisticPage.zoom);
                map?.setPitch(optimisticPage.pitch);
                map?.setBearing(optimisticPage.bearing);
              }}
              size="icon-sm"
            >
              <Undo2Icon className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!hasMoved}
              onClick={async () => {
                const center = map?.getCenter();
                const zoom = map?.getZoom();
                const pitch = map?.getPitch();
                const bearing = map?.getBearing();

                if (
                  center !== undefined &&
                  zoom !== undefined &&
                  pitch !== undefined &&
                  bearing !== undefined
                ) {
                  updatePage({
                    ...optimisticPage,
                    center: {
                      x: center.lng,
                      y: center.lat,
                    },
                    zoom,
                    pitch,
                    bearing,
                  });

                  updatePageServer({
                    center: {
                      x: center.lng,
                      y: center.lat,
                    },
                    zoom,
                    pitch,
                    bearing,
                  }).catch(() => {
                    toast("There was an error saving the location");
                  });
                  // onLocationSave({
                  // latitude: center.lat,
                  // longitude: center.lng,
                  // zoom,
                  // pitch,
                  // bearing,
                  //   padding: {
                  //     top: 0,
                  //     bottom: 0,
                  //     left: 0,
                  //     right: 0,
                  //   },
                  // });
                }
              }}
              size="sm"
            >
              <SaveIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save Map Position</TooltipContent>
        </Tooltip>
        <Button onClick={() => setOpenEditor(false)} size="sm">
          Cancel
        </Button>
      </TooltipProvider>
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
