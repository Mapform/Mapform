import { Button } from "@mapform/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useMapform, useMapformContent } from "~/components/mapform";
import { cn } from "@mapform/lib/classnames";
import { useProject } from "../project-context";
import {
  EllipsisIcon,
  FocusIcon,
  HandIcon,
  MapPinPlusIcon,
  ScanIcon,
  SearchIcon,
  SplinePointerIcon,
} from "lucide-react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useEffect, useState } from "react";

interface EditBarProps {
  onSearchOpenChange: (isOpen: boolean) => void;
}

export function EditBar({ onSearchOpenChange }: EditBarProps) {
  const { map } = useMapform();
  const { updatePageServerAction } = useProject();
  const { drawerValues } = useMapformContent();

  const isSearchOpen = drawerValues.includes("location-search");
  const [activeTool, setActiveTool] = useState<"hand" | "point" | "line">(
    "hand",
  );

  const currentPage = updatePageServerAction.optimisticState;

  if (!currentPage) {
    return null;
  }

  const handleSaveMapPosition = () => {
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

      updatePageServerAction.execute({
        ...currentPage,
        ...payload,
      });
    }
  };

  useEffect(() => {
    let draw: MapboxDraw | undefined;

    if (activeTool === "point") {
      draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          point: true,
          trash: true,
        },
        defaultMode: "draw_point",
      });
      map?.addControl(draw);
    }

    return () => {
      if (draw) {
        map?.removeControl(draw);
      }
    };
  }, [activeTool, map]);

  useEffect(() => {
    let draw: MapboxDraw | undefined;

    if (activeTool === "line") {
      draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        defaultMode: "draw_polygon",
      });
      map?.addControl(draw);
    }

    return () => {
      if (draw) {
        map?.removeControl(draw);
      }
    };
  }, [activeTool, map]);

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center divide-x rounded-xl border bg-white p-1.5 shadow-lg",
        )}
      >
        <div className="flex gap-1 pr-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  if (!isSearchOpen) {
                    onSearchOpenChange(true);
                  }
                }}
                size="icon"
                variant={isSearchOpen ? "default" : "ghost"}
              >
                <SearchIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search tool</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-1 px-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setActiveTool("hand");
                  onSearchOpenChange(false);
                }}
                size="icon"
                variant={
                  activeTool === "hand" && !isSearchOpen ? "default" : "ghost"
                }
              >
                <HandIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hand tool</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setActiveTool("point");
                  onSearchOpenChange(false);
                }}
                size="icon"
                variant={
                  activeTool === "point" && !isSearchOpen ? "default" : "ghost"
                }
              >
                <MapPinPlusIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Point tool</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setActiveTool("line");
                  onSearchOpenChange(false);
                }}
                size="icon"
                variant={
                  activeTool === "line" && !isSearchOpen ? "default" : "ghost"
                }
              >
                <SplinePointerIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Line tool</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-1 pl-1.5">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <EllipsisIcon className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Map options</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="top">
              <DropdownMenuItem
                disabled={updatePageServerAction.isPending}
                onClick={handleSaveMapPosition}
              >
                <ScanIcon className="mr-2 size-4" />
                Set default view
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  map?.setCenter([currentPage.center.x, currentPage.center.y]);
                  map?.setZoom(currentPage.zoom);
                  map?.setPitch(currentPage.pitch);
                  map?.setBearing(currentPage.bearing);
                }}
              >
                <FocusIcon className="mr-2 size-4" />
                Re-center view
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}
