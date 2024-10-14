import { Button } from "@mapform/ui/components/button";
import { EditIcon, SaveIcon, SearchIcon, Undo2Icon } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CommandDialog } from "@mapform/ui/components/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useMap, type MapboxEvent } from "@mapform/mapform";
import { CustomBlock } from "@mapform/blocknote";
import type { PageWithLayers } from "~/data/pages/get-page-with-layers";
import { toast } from "@mapform/ui/components/toaster";
import { SearchLocationMarker as MapMarker } from "@mapform/mapform";
import { SearchLocationMarker } from "./search-location-marker";
import { usePage } from "../../page-context";
import { CommandSearch } from "./command-search";
import { useStandardLayout } from "~/app/(authenticated)/[wsSlug]/standard-layout/context";

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
  const [openSearch, setOpenSearch] = useState(false);
  const { updatePage, openMapEditor, setOpenMapEditor } = usePage();
  const { showDrawer, toggleDrawer } = useStandardLayout();

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

  const handleOnMove = (e: MapboxEvent) => {
    setMovedCoords({
      lat: e.target.getCenter().lat,
      lng: e.target.getCenter().lng,
      zoom: e.target.getZoom(),
      pitch: e.target.getPitch(),
      bearing: e.target.getBearing(),
    });
  };

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

  useEffect(() => {
    if (map) {
      map.on("moveend", handleOnMove);

      return () => {
        map.off("moveend", handleOnMove);
      };
    }
  }, [map, optimisticPage]);

  const roundLocation = (num: number) => Math.round(num * 1000000) / 1000000;

  const hasMoved =
    roundLocation(movedCoords.lat) !== roundLocation(optimisticPage.center.y) ||
    roundLocation(movedCoords.lng) !== roundLocation(optimisticPage.center.x) ||
    movedCoords.zoom !== optimisticPage.zoom ||
    movedCoords.pitch !== optimisticPage.pitch ||
    movedCoords.bearing !== optimisticPage.bearing;

  if (!openMapEditor) {
    return (
      <Button
        onClick={() => {
          if (!showDrawer) {
            toggleDrawer();
          }
          setOpenMapEditor(true);
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
                }
              }}
              size="sm"
            >
              <SaveIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save Map Position</TooltipContent>
        </Tooltip>
        <Button onClick={() => setOpenMapEditor(false)} size="sm">
          Cancel
        </Button>
      </TooltipProvider>
      {searchLocation ? (
        <MapMarker
          searchLocationMarker={{
            latitude: searchLocation.latitude,
            longitude: searchLocation.longitude,
            name: "Test",
          }}
        >
          <SearchLocationMarker title="Yolo" />
        </MapMarker>
      ) : null}
    </>
  );
}
