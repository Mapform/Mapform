import { Button } from "@mapform/ui/components/button";
import {
  MapPinIcon,
  MapPinPlusIcon,
  PinIcon,
  SearchIcon,
  Undo2Icon,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CommandDialog } from "@mapform/ui/components/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import type { MapMouseEvent } from "mapbox-gl";
import { useMapform, type MapboxEvent } from "@mapform/mapform";
import { cn } from "@mapform/lib/classnames";
import type { SearchFeature } from "@mapform/map-utils/types";
import { SearchLocationMarker as MapMarker } from "@mapform/mapform";
import type { PageWithLayers } from "@mapform/backend/pages/get-page-with-layers";
import { useProject } from "../../project-context";
import { SearchLocationMarker } from "./search-location-marker";
import { CommandSearch } from "./command-search";

interface EditBarInnerProps {
  currentPage: PageWithLayers;
}

const queryClient = new QueryClient();

export function EditBar() {
  const { currentPage } = useProject();

  if (!currentPage) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <EditBarInner currentPage={currentPage} />
    </QueryClientProvider>
  );
}

function EditBarInner({ currentPage }: EditBarInnerProps) {
  const { map, setDrawerOpen, mapContainer, drawerOpen } = useMapform();
  const { currentProject, updatePageServer, updatePageOptimistic } =
    useProject();
  const [openSearch, setOpenSearch] = useState(false);
  const [isSelectingPoint, setIsSelectingPoint] = useState(false);
  const [selectingPinLocation, setSelectingPinLocation] = useState({
    x: 0,
    y: 0,
  });

  const [movedCoords, setMovedCoords] = useState<{
    lat: number;
    lng: number;
    zoom: number;
    pitch: number;
    bearing: number;
  }>({
    lat: currentPage.center.y,
    lng: currentPage.center.x,
    zoom: currentPage.zoom,
    pitch: currentPage.pitch,
    bearing: currentPage.bearing,
  });
  const [searchLocation, setSearchLocation] = useState<SearchFeature | null>(
    null,
  );

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
      lat: currentPage.center.y,
      lng: currentPage.center.x,
      zoom: currentPage.zoom,
      pitch: currentPage.pitch,
      bearing: currentPage.bearing,
    });
  }, [currentPage]);

  useEffect(() => {
    if (map) {
      map.on("moveend", handleOnMove);

      return () => {
        map.off("moveend", handleOnMove);
      };
    }
  }, [map, currentPage]);

  useEffect(() => {
    const mapEl = mapContainer.current;

    const updatePosition = (event: MouseEvent) => {
      const rect = mapContainer.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      setSelectingPinLocation({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    const handleLocationSelect = (e: MapMouseEvent) => {
      setSearchLocation({
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
        icon: "unknown",
      });
      setIsSelectingPoint(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSelectingPoint(false);
      }
    };

    // Add mousemove event listener
    if (isSelectingPoint && map) {
      map.getCanvas().style.cursor = "none";
      map.on("click", handleLocationSelect);
      mapEl?.addEventListener("mousemove", updatePosition);
      window.addEventListener("keydown", handleEscape);
    }

    // Clean up event listener on component unmount
    return () => {
      if (isSelectingPoint && map) {
        map.getCanvas().style.cursor = "grab";
        setSelectingPinLocation({ x: 0, y: 0 });
        map.off("click", handleLocationSelect);
        mapEl?.removeEventListener("mousemove", updatePosition);
        window.removeEventListener("keydown", handleEscape);
      }
    };
  }, [mapContainer, isSelectingPoint, map]);

  const roundLocation = (num: number) => Math.round(num * 1000000) / 1000000;

  const hasMoved =
    roundLocation(movedCoords.lat) !== roundLocation(currentPage.center.y) ||
    roundLocation(movedCoords.lng) !== roundLocation(currentPage.center.x) ||
    movedCoords.zoom !== currentPage.zoom ||
    movedCoords.pitch !== currentPage.pitch ||
    movedCoords.bearing !== currentPage.bearing;

  const pageLayers = currentProject.pageLayers.filter(
    (layer) =>
      layer.pageId === currentPage.id &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- We do need this
      (layer.type === "point" || layer.type === "marker"),
  );

  return (
    <>
      {/* This container is used to center the controls within the map-side of the map. There is probably a better way to do this. */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 right-0 top-0 transition-[width] duration-200",
          drawerOpen ? "w-[calc(100%-392px)]" : "w-full",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center rounded-lg border bg-white p-1 shadow-lg",
          )}
        >
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    setOpenSearch(true);
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <SearchIcon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search Locations</TooltipContent>
            </Tooltip>
            <CommandDialog
              dialogContentClassName="-translate-y-[150px]"
              onOpenChange={setOpenSearch}
              open={openSearch}
              shouldFilter={false}
            >
              <CommandSearch
                setOpenSearch={setOpenSearch}
                setSearchLocation={setSearchLocation}
              />
            </CommandDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={cn({
                    "bg-accent": isSelectingPoint,
                  })}
                  onClick={() => {
                    setIsSelectingPoint(!isSelectingPoint);
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <MapPinPlusIcon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Point to Map</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={!hasMoved}
                  onClick={() => {
                    map?.setCenter([
                      currentPage.center.x,
                      currentPage.center.y,
                    ]);
                    map?.setZoom(currentPage.zoom);
                    map?.setPitch(currentPage.pitch);
                    map?.setBearing(currentPage.bearing);
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <Undo2Icon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go Back To Last Pinned Location</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={!hasMoved}
                  onClick={() => {
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
                      const payload = {
                        id: currentPage.id,
                        center: {
                          x: center.lng,
                          y: center.lat,
                        },
                        zoom,
                        pitch,
                        bearing,
                      };

                      updatePageServer.execute(payload);

                      updatePageOptimistic({
                        ...currentPage,
                        ...payload,
                      });
                    }
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <PinIcon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pin Map Position</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <MapMarker searchLocationMarker={searchLocation}>
          <SearchLocationMarker
            pageLayers={pageLayers}
            searchLocation={searchLocation}
            setDrawerOpen={setDrawerOpen}
            setSearchLocation={setSearchLocation}
          />
        </MapMarker>
      </div>

      {isSelectingPoint ? (
        <MapPinIcon
          className="pointer-events-none absolute z-50 size-6 -translate-x-1/2 -translate-y-1/2 fill-white shadow-sm outline-2 outline-black"
          style={{
            left: selectingPinLocation.x,
            top: selectingPinLocation.y,
          }}
        />
      ) : null}
    </>
  );
}
