import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import type { LucideIcon } from "lucide-react";
import {
  BikeIcon,
  CarIcon,
  ChevronDown,
  FootprintsIcon,
  SplineIcon,
  CheckIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMapform } from "~/components/mapform";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { cn } from "@mapform/lib/classnames";
import type { Position } from "geojson";
import type { GeoapifyRoute } from "@mapform/map-utils/types";
import mapboxgl from "mapbox-gl";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { LineToolPopover } from "./popover";
import { useDrawPoints } from "~/lib/map-tools/points";
import { useDrawLines } from "~/lib/map-tools/lines";
interface LineToolProps {
  isActive: boolean;
  isSearchOpen: boolean;
  selectedLineType: keyof typeof lineTypes;
  setSelectedLineType: (lineType: keyof typeof lineTypes) => void;
  onClick: () => void;
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

const fetchDirections = async (
  waypoints: Position[],
  selectedLineType: keyof typeof lineTypes,
) => {
  const response = await fetch(
    `/api/places/routing?waypoints=${waypoints.map((w) => `lonlat:${w.join(",")}`).join("|")}&mode=${selectedLineType}`,
  );
  const json = await response.json();
  return json.data as GeoapifyRoute;
};

export function LineTool(props: LineToolProps) {
  const { map } = useMapform();

  if (!map) return null;

  return <LineToolInner {...props} map={map} />;
}

const POINT_LAYER_ID = "line-tool-points";
const POINT_SOURCE_ID = "line-tool-points";
const LINE_LAYER_ID = "line-tool-lines";
const LINE_SOURCE_ID = "line-tool-lines";

function LineToolInner({
  map,
  isActive,
  isSearchOpen,
  selectedLineType,
  setSelectedLineType,
  onClick,
}: LineToolProps & { map: mapboxgl.Map }) {
  const [open, setOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(true);
  const [linePoints, setLinePoints] = useState<Position[]>([]);
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(
    null,
  );

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

  const location = useMemo(() => getCenterOfPoints(linePoints), [linePoints]);

  const debouncedLinePoints = useDebounce(linePoints, 200);

  const { data: directions, isFetching } = useQuery({
    enabled: debouncedLinePoints.length > 1 && selectedLineType !== "line",
    queryKey: ["directions", selectedLineType, ...debouncedLinePoints],
    queryFn: () => fetchDirections(debouncedLinePoints, selectedLineType),
    retry: false,
    placeholderData: (prev) => prev,
  });

  const resetLineTool = useCallback(() => {
    setLinePoints([]);
    setIsSelecting(true);
    map.getCanvas().style.cursor = "crosshair";
  }, [map]);

  useEffect(() => {
    if (isActive) {
      map.getCanvas().style.cursor = "crosshair";
    } else {
      map.getCanvas().style.cursor = "";
    }

    return () => {
      if (!map.isStyleLoaded()) return;
      map.getCanvas().style.cursor = "";
    };
  }, [isActive, map]);

  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (!isSelecting) return; // Only allow clicking to add points when in selecting mode
      const { lng, lat } = e.lngLat;
      setLinePoints((prev) => [...prev, [lng, lat]]);
    };

    const handleMouseUp = (e: mapboxgl.MapMouseEvent) => {
      if (draggedPointIndex !== null) {
        e.preventDefault();
        setDraggedPointIndex(null);
        map.getCanvas().style.cursor = "move";
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsSelecting(false);
        map.getCanvas().style.cursor = "";
      } else if (e.key === "Escape") {
        if (isSelecting) {
          resetLineTool();
        } else {
          setIsSelecting(true);
          map.getCanvas().style.cursor = "crosshair";
        }
      } else if (e.key === "Backspace") {
        if (isSelecting) {
          setLinePoints((prev) => prev.slice(0, -1));
        } else {
          resetLineTool();
        }
      }
    };

    map.on("click", handleClick);
    map.on("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      map.off("click", handleClick);
      map.off("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    map,
    isActive,
    isSelecting,
    linePoints,
    draggedPointIndex,
    resetLineTool,
  ]);

  useDrawPoints({
    map,
    points: linePoints,
    isVisible: isSelecting,
    sourceId: POINT_SOURCE_ID,
    layerId: POINT_LAYER_ID,
  });

  useDrawLines({
    map,
    coordinates:
      selectedLineType === "line"
        ? [linePoints]
        : linePoints.length > 1
          ? [
              (directions?.results[0]?.geometry.flatMap((r) => r) ?? []).map(
                (c) => [c.lon, c.lat],
              ),
            ]
          : [],
    sourceId: LINE_SOURCE_ID,
    layerId: LINE_LAYER_ID,
  });

  // Add vertex click handler and cursor styles
  useEffect(() => {
    const handleVertexMouseEnter = (e: mapboxgl.MapMouseEvent) => {
      if (isSelecting) {
        e.preventDefault();
        map.getCanvas().style.cursor = "move";
      }
    };

    const handleVertexMouseLeave = (e: mapboxgl.MapMouseEvent) => {
      if (isSelecting) {
        e.preventDefault();
        map.getCanvas().style.cursor = "crosshair";
      }
    };

    const handleVertexClick = (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[];
      },
    ) => {
      const index = e.features?.[0]?.properties?.index as number | undefined;

      if (index === undefined || index < 0 || !isSelecting) return;

      e.preventDefault();
      setDraggedPointIndex(index);
      map.getCanvas().style.cursor = "grabbing";
    };

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (isSelecting && draggedPointIndex !== null) {
        e.preventDefault();
        const { lng, lat } = e.lngLat;
        setLinePoints((prev) => {
          const newPoints = [...prev];
          newPoints[draggedPointIndex] = [lng, lat];
          return newPoints;
        });
      }
    };

    if (isSelecting) {
      map.on("mouseenter", POINT_LAYER_ID, handleVertexMouseEnter);
      map.on("mouseleave", POINT_LAYER_ID, handleVertexMouseLeave);
      map.on("mousedown", POINT_LAYER_ID, handleVertexClick);
      map.on("mousemove", handleMouseMove);
    }

    return () => {
      map.off("mouseenter", POINT_LAYER_ID, handleVertexMouseEnter);
      map.off("mouseleave", POINT_LAYER_ID, handleVertexMouseLeave);
      map.off("mousedown", POINT_LAYER_ID, handleVertexClick);
      map.off("mousemove", handleMouseMove);
    };
  }, [map, isSelecting, draggedPointIndex]);

  return (
    <>
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              size="icon"
              variant={isActive && !isSearchOpen ? "default" : "ghost"}
            >
              {(() => {
                const LineTypeIcon = lineTypes[selectedLineType]?.icon;
                return LineTypeIcon ? (
                  <LineTypeIcon className="size-5" />
                ) : null;
              })()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Line tool</TooltipContent>
        </Tooltip>
        <Popover modal onOpenChange={setOpen} open={open}>
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
                          setSelectedLineType(key as keyof typeof lineTypes);
                          setOpen(false);
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
        </Popover>
      </div>
      {location && !isSelecting && (
        <LineToolPopover
          location={new mapboxgl.LngLat(location[0]!, location[1]!)}
          onSave={resetLineTool}
          isFetching={isFetching}
          coordinates={
            selectedLineType === "line"
              ? linePoints.map((p) => [p[0]!, p[1]!])
              : (directions?.results[0]?.geometry.flatMap((r) => r) ?? []).map(
                  (c) => [c.lon, c.lat],
                )
          }
        />
      )}
    </>
  );
}
