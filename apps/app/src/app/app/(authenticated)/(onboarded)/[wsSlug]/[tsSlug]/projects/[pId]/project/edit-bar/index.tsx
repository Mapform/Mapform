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
import type { LucideIcon } from "lucide-react";
import {
  BikeIcon,
  CarIcon,
  CheckIcon,
  Command,
  PentagonIcon,
  ChevronDown,
  FootprintsIcon,
  SplineIcon,
  MapPinPlusIcon,
} from "lucide-react";
import type { Position } from "geojson";
import { FeaturePopover } from "./popover";
import mapboxgl from "mapbox-gl";
import {
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { useProject } from "../../project-context";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";

interface EditBarProps {
  onSearchOpenChange: (isOpen: boolean) => void;
}

export const lineTypes: Record<
  "line" | "walk" | "bicycle" | "drive",
  { icon: LucideIcon; label: string }
> = {
  line: {
    icon: SplineIcon,
    label: "Line",
  },
  walk: {
    icon: FootprintsIcon,
    label: "Walking route",
  },
  bicycle: {
    icon: BikeIcon,
    label: "Cycling route",
  },
  drive: {
    icon: CarIcon,
    label: "Driving route",
  },
} as const;

export function EditBar({ onSearchOpenChange }: EditBarProps) {
  const { map, draw, drawFeature, setDrawFeature } = useMapform();
  const { drawerValues } = useMapformContent();
  const setQueryString = useSetQueryString();
  const isSearchOpen = drawerValues.includes("location-search");
  const [activeMode, setActiveMode] = useState<
    "hand" | "shape" | "line" | "point"
  >("hand");
  const [selectedLineType, setSelectedLineType] =
    useState<keyof typeof lineTypes>("line");

  // Change the active mode to hand when the draw mode changes
  useEffect(() => {
    const handleDrawModeChange = () => {
      setActiveMode("hand");
    };

    map?.on("draw.modechange", handleDrawModeChange);

    return () => {
      map?.off("draw.modechange", handleDrawModeChange);
    };
  }, [map]);

  const location = useMemo(() => {
    if (!drawFeature) return null;

    if (drawFeature.geometry.type === "Point") {
      return drawFeature.geometry.coordinates;
    }

    if (drawFeature.geometry.type === "Polygon") {
      return getCenterOfPoints(drawFeature.geometry.coordinates[0]!);
    }

    if (drawFeature.geometry.type === "LineString") {
      return getCenterOfPoints(drawFeature.geometry.coordinates);
    }

    return null;
  }, [drawFeature]);

  return (
    <div
      className={cn(
        "pointer-events-auto absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 transform items-center divide-x rounded-xl border bg-white p-1.5 shadow-lg",
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
        <div className="flex items-center">
          {/* POINT TOOL */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  draw?.changeMode("draw_point");
                  setActiveMode("point");
                }}
                size="icon"
                variant={
                  activeMode === "point" && !isSearchOpen ? "default" : "ghost"
                }
              >
                <MapPinPlusIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Point tool</TooltipContent>
          </Tooltip>

          {/* LINE TOOL */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  draw?.changeMode("draw_line_string");
                  setActiveMode("line");
                }}
                size="icon"
                variant={
                  activeMode === "line" && !isSearchOpen ? "default" : "ghost"
                }
              >
                {(() => {
                  const LineTypeIcon = lineTypes[selectedLineType].icon;
                  return LineTypeIcon ? (
                    <LineTypeIcon className="size-5" />
                  ) : null;
                })()}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Line tool</TooltipContent>
          </Tooltip>
          {/* TODO: Add suport for directional lines */}
          {/* <Popover
            modal
            // onOpenChange={setOpen}
            // open={open}
          >
            <PopoverTrigger asChild>
              <button className="hover:bg-accent hover:text-accent-foreground ml-[1px] h-full rounded-md p-0.5">
                <ChevronDown size={10} strokeWidth={3} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-[200px] p-0" side="top">
              <Command>
                <CommandList>
                  <CommandEmpty>No line type found.</CommandEmpty>
                  <CommandGroup>
                    {Object.entries(lineTypes).map(
                      ([key, { icon: Icon, label }]) => (
                        <CommandItem
                          key={key}
                          value={label}
                          onSelect={() => {
                            // setSelectedLineType(key as keyof typeof lineTypes);
                            // setOpen(false);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Icon className="size-4 flex-shrink-0" />
                          <span className="flex-1 truncate text-left">
                            {label}
                          </span>
                          <CheckIcon
                            className={cn(
                              "ml-auto size-4",
                              selectedLineType === key
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ),
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover> */}

          {/* POLYGON TOOL */}
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
      {location && drawFeature && (
        <FeaturePopover
          location={new mapboxgl.LngLat(location[0]!, location[1]!)}
          onSave={(id) => {
            draw?.delete(drawFeature.id as string);
            setDrawFeature(null);
            draw?.changeMode("simple_select");
            setQueryString({
              key: "feature",
              value: id,
            });
          }}
          isFetching={false}
          feature={drawFeature}
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
