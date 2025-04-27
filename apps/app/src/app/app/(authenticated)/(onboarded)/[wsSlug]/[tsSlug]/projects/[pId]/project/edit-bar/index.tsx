import { cn } from "@mapform/lib/classnames";
import { useMapform, useMapformContent } from "~/components/mapform";
import { useMemo, useEffect, useState } from "react";
import { HandTool } from "./hand-tool";
import { MapOptions } from "./map-options";
import { SearchTool } from "./search-tool";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { Button } from "@mapform/ui/components/button";
import { PentagonIcon } from "lucide-react";
import type { Position } from "geojson";
import { FeaturePopover } from "./popover";
import mapboxgl from "mapbox-gl";

interface EditBarProps {
  onSearchOpenChange: (isOpen: boolean) => void;
}

export function EditBar({ onSearchOpenChange }: EditBarProps) {
  const { map, draw, activeFeature, setActiveFeature } = useMapform();
  const { drawerValues } = useMapformContent();
  const isSearchOpen = drawerValues.includes("location-search");
  const [activeMode, setActiveMode] = useState<"hand" | "shape">("hand");

  useEffect(() => {
    const handleDrawModeChange = (e: { mode: string }) => {
      console.log(e.mode);
      if (e.mode === "draw_polygon") {
        setActiveMode("shape");
      } else {
        setActiveMode("hand");
      }
    };

    map?.on("draw.modechange", handleDrawModeChange);

    return () => {
      map?.off("draw.modechange", handleDrawModeChange);
    };
  }, [map]);

  const location = useMemo(() => {
    if (!activeFeature) return null;

    if (activeFeature.geometry.type === "Point") {
      return activeFeature.geometry.coordinates;
    }

    if (activeFeature.geometry.type === "Polygon") {
      return getCenterOfPoints(activeFeature.geometry.coordinates[0]!);
    }

    return null;
  }, [activeFeature]);

  return (
    <div
      className={cn(
        "pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center divide-x rounded-xl border bg-white p-1.5 shadow-lg",
      )}
    >
      <div className="flex gap-1 pr-1.5">
        <SearchTool
          isActive={isSearchOpen}
          onClick={() => {
            if (!isSearchOpen) {
              onSearchOpenChange(true);
            }
          }}
        />
      </div>
      <div className="flex gap-1 px-1.5">
        <HandTool
          isActive={activeMode === "hand" && !isSearchOpen}
          isSearchOpen={isSearchOpen}
          onClick={() => {
            setActiveMode("hand");
            draw?.changeMode("simple_select");
            onSearchOpenChange(false);
          }}
        />
        {/* <PointTool
          isActive={activeMode === "point" && !isSearchOpen}
          isSearchOpen={isSearchOpen}
          onClick={() => {
            // setActiveTool("point");
            onSearchOpenChange(false);
          }}
        /> */}
        {/* <LineTool
          selectedLineType={selectedLineType}
          setSelectedLineType={setSelectedLineType}
          isActive={activeTool === "line" && !isSearchOpen}
          isSearchOpen={isSearchOpen}
          onClick={() => {
            // setActiveTool("line");
            onSearchOpenChange(false);
          }}
        /> */}
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  draw?.changeMode("draw_polygon");
                  setActiveMode("shape");
                }}
                size="icon"
                variant={
                  activeMode === "shape" && !isSearchOpen ? "default" : "ghost"
                }
              >
                <PentagonIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Shape tool</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex gap-1 pl-1.5">
        <MapOptions />
      </div>
      {location && (
        <FeaturePopover
          location={new mapboxgl.LngLat(location[0]!, location[1]!)}
          onSave={() => {
            if (activeFeature) {
              draw?.delete(activeFeature.id as string);
              setActiveFeature(null);
              draw?.changeMode("draw_polygon");
            }
          }}
          isFetching={false}
          coordinates={activeFeature?.geometry.coordinates as Position[][]}
        />
      )}
    </div>
  );
}

const getCenterOfPoints = (points: Position[]): Position | null => {
  if (points.length === 0) return null;

  const sum = points.reduce<{ lng: number; lat: number }>(
    (acc, point) => {
      const [lng, lat] = point as [number, number];
      acc.lng += lng;
      acc.lat += lat;
      return acc;
    },
    { lng: 0, lat: 0 },
  );

  return [sum.lng / points.length, sum.lat / points.length];
};
