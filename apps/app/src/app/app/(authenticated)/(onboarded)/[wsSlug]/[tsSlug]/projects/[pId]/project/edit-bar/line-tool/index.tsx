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
  BookmarkIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMapform } from "~/components/mapform";
import { useQuery } from "@tanstack/react-query";
import type { FeatureCollection } from "geojson";
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
import { useReverseGeocode } from "~/hooks/use-reverse-geocode";
import { SearchPopover } from "../search-popover";
import mapboxgl from "mapbox-gl";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { LayerSavePopover } from "../../layer-save-popover";
import { LineToolPopover } from "./popover";

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

export function LineTool({
  isActive,
  isSearchOpen,
  selectedLineType,
  setSelectedLineType,
  onClick,
}: LineToolProps) {
  const { map } = useMapform();
  const [open, setOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(true);
  const [linePoints, setLinePoints] = useState<Position[]>([]);
  const [cursorPosition, setCursorPosition] = useState<Position | null>(null);
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
  const debouncedLocation = useDebounce(location, 200);

  const { selectedFeature } = useReverseGeocode({
    lat: debouncedLocation?.[1] ?? null,
    lng: debouncedLocation?.[0] ?? null,
    enabled: !!debouncedLocation,
  });

  const debouncedLinePoints = useDebounce(linePoints, 200);

  const { data: directions, isFetching } = useQuery({
    enabled: debouncedLinePoints.length > 1 && selectedLineType !== "line",
    queryKey: ["directions", selectedLineType, ...debouncedLinePoints],
    queryFn: () => fetchDirections(debouncedLinePoints, selectedLineType),
    retry: false,
    placeholderData: (prev) => prev,
  });

  const resetLineTool = useCallback(() => {
    if (!map) return;

    setLinePoints([]);
    setCursorPosition(null);
    setIsSelecting(true);
    map.getCanvas().style.cursor = "crosshair";
  }, [map]);

  useEffect(() => {
    if (!map) return;

    if (isActive) {
      map.getCanvas().style.cursor = "crosshair";
    } else {
      map.getCanvas().style.cursor = "";
    }

    return () => {
      const currentLineVerticesSource = map.getSource("line-vertices") as
        | mapboxgl.AnySourceImpl
        | undefined;

      const currentLineSource = map.getSource("line-path") as
        | mapboxgl.AnySourceImpl
        | undefined;

      if (currentLineVerticesSource) {
        map.removeSource("line-vertices");
        map.removeLayer("line-vertices");
      }

      if (currentLineSource) {
        map.removeSource("line-path");
        map.removeLayer("line-path");
      }
    };
  }, [isActive, map]);

  useEffect(() => {
    if (!map || !isActive) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (!isSelecting) return; // Only allow clicking to add points when in selecting mode
      const { lng, lat } = e.lngLat;
      setLinePoints((prev) => [...prev, [lng, lat]]);
    };

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (isSelecting && linePoints.length > 0) {
        const { lng, lat } = e.lngLat;
        setCursorPosition([lng, lat]);
      } else if (draggedPointIndex !== null) {
        e.preventDefault();
        const { lng, lat } = e.lngLat;
        setLinePoints((prev) => {
          const newPoints = [...prev];
          newPoints[draggedPointIndex] = [lng, lat];
          return newPoints;
        });
      }
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
        setCursorPosition(null);
      } else if (e.key === "Escape") {
        resetLineTool();
      }
    };

    map.on("click", handleClick);
    map.on("mousemove", handleMouseMove);
    map.on("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      map.off("click", handleClick);
      map.off("mousemove", handleMouseMove);
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

  // Used for creating points on the map
  const verticesGeoJson = useMemo(
    () =>
      ({
        type: "FeatureCollection",
        features: linePoints.map((point, index) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: point,
          },
          properties: {
            index,
          },
        })),
      }) satisfies FeatureCollection,
    [linePoints],
  );

  // Used for creating directions between points using Routing API
  const directionsGeoJson = useMemo(() => {
    const coordinates = (
      directions?.results[0]?.geometry.flatMap((r) => r) ?? []
    ).map((c) => [c.lon, c.lat]);

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates,
          },
          properties: {},
        },
      ],
    } satisfies FeatureCollection;
  }, [directions]);

  // Used for creating straight lines between points
  const lineGeoJson = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: linePoints,
          },
          properties: {},
        },
      ],
    } satisfies FeatureCollection;
  }, [linePoints]);

  // Line Vertices
  useEffect(() => {
    if (!map) return;

    // Handle points layer
    const currentPointSource = map.getSource("line-vertices") as
      | mapboxgl.AnySourceImpl
      | undefined;

    if (currentPointSource) {
      // Update the source data
      (currentPointSource as mapboxgl.GeoJSONSource).setData(verticesGeoJson);
    } else {
      // Only add the source and layer if they don't exist
      map.addSource("line-vertices", {
        type: "geojson",
        data: verticesGeoJson,
      });

      map.addLayer({
        id: "line-vertices",
        type: "circle",
        source: "line-vertices",
        paint: {
          "circle-radius": 5,
          "circle-color": "#3b82f6",
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 2,
        },
        // interactive: true,
      });
    }
  }, [map, verticesGeoJson]);

  // Draw lines
  useEffect(() => {
    if (!map) return;

    const geoJson =
      selectedLineType === "line" ? lineGeoJson : directionsGeoJson;

    const currentLineSource = map.getSource("line-path") as
      | mapboxgl.AnySourceImpl
      | undefined;

    if (currentLineSource) {
      (currentLineSource as mapboxgl.GeoJSONSource).setData(geoJson);
    } else {
      map.addSource("line-path", {
        type: "geojson",
        data: geoJson,
      });

      map.addLayer({
        id: "line-path",
        type: "line",
        source: "line-path",
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
        },
      });
    }
  }, [map, directionsGeoJson, lineGeoJson, isSelecting, selectedLineType]);

  // Update vertices layer to be interactive when not selecting
  useEffect(() => {
    if (!map) return;

    const currentLayer = map.getLayer("line-vertices");
    if (currentLayer) {
      map.setPaintProperty(
        "line-vertices",
        "circle-radius",
        isSelecting ? 5 : 6,
      );
      map.setPaintProperty(
        "line-vertices",
        "circle-color",
        isSelecting ? "#3b82f6" : "#2563eb",
      );
    }
  }, [map, isSelecting]);

  // Add vertex click handler and cursor styles
  useEffect(() => {
    if (!map) return;

    const handleVertexMouseEnter = (e: mapboxgl.MapMouseEvent) => {
      if (!isSelecting) {
        e.preventDefault();
        map.getCanvas().style.cursor = "move";
      }
    };

    const handleVertexMouseLeave = (e: mapboxgl.MapMouseEvent) => {
      if (!isSelecting) {
        e.preventDefault();
        map.getCanvas().style.cursor = "";
      }
    };

    const handleVertexClick = (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[];
      },
    ) => {
      const index = e.features?.[0]?.properties?.index as number | undefined;

      if (index === undefined || index < 0 || isSelecting) return;

      e.preventDefault();
      setDraggedPointIndex(index);
      map.getCanvas().style.cursor = "grabbing";
    };

    if (!isSelecting) {
      map.on("mouseenter", "line-vertices", handleVertexMouseEnter);
      map.on("mouseleave", "line-vertices", handleVertexMouseLeave);
      map.on("mousedown", "line-vertices", handleVertexClick);
    }

    return () => {
      map.off("mouseenter", "line-vertices", handleVertexMouseEnter);
      map.off("mouseleave", "line-vertices", handleVertexMouseLeave);
      map.off("mousedown", "line-vertices", handleVertexClick);
    };
  }, [map, isSelecting]);

  // Draw temporary line to cursor
  // useEffect(() => {
  //   if (!map) return;

  //   // Add the source and layer once when the component mounts
  //   if (!map.getSource("temp-line-path")) {
  //     map.addSource("temp-line-path", {
  //       type: "geojson",
  //       data: {
  //         type: "FeatureCollection",
  //         features: [],
  //       },
  //     });

  //     map.addLayer({
  //       id: "temp-line-path",
  //       type: "line",
  //       source: "temp-line-path",
  //       paint: {
  //         "line-color": "#3b82f6",
  //         "line-width": 2,
  //         "line-dasharray": [1, 1],
  //       },
  //     });
  //   }

  //   // Update the source data when cursor position or line points change
  //   if (cursorPosition && linePoints.length > 0) {
  //     const lastPoint = linePoints[linePoints.length - 1];
  //     if (!lastPoint) return;

  //     const tempLineGeoJson = {
  //       type: "FeatureCollection",
  // features: [
  //   {
  //     type: "Feature",
  //     geometry: {
  //       type: "LineString",
  //       coordinates: [lastPoint, cursorPosition] as Position[],
  //     },
  //     properties: {},
  //   },
  // ],
  //     } satisfies FeatureCollection;

  //     (map.getSource("temp-line-path") as mapboxgl.GeoJSONSource).setData(
  //       tempLineGeoJson,
  //     );
  //   } else {
  //     // Clear the line when there's no cursor position or no points
  //     (map.getSource("temp-line-path") as mapboxgl.GeoJSONSource).setData({
  //       type: "FeatureCollection",
  //       features: [],
  //     });
  //   }
  // }, [map, cursorPosition, linePoints]);

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
      {debouncedLocation && map && !isSelecting && (
        <LineToolPopover
          location={
            new mapboxgl.LngLat(debouncedLocation[0]!, debouncedLocation[1]!)
          }
          onSave={resetLineTool}
          selectedFeature={selectedFeature}
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
