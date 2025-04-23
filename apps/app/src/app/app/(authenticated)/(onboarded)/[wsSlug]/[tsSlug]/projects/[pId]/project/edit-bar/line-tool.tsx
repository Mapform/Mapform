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
import { useEffect, useMemo, useState } from "react";
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

interface LineToolProps {
  isActive: boolean;
  isSearchOpen: boolean;
  selectedLineType: keyof typeof lineTypes;
  setSelectedLineType: (lineType: keyof typeof lineTypes) => void;
  onClick: () => void;
}

export const lineTypes: Record<string, { icon: LucideIcon; label: string }> = {
  line: {
    icon: SplineIcon,
    label: "Line",
  },
  walking: {
    icon: FootprintsIcon,
    label: "Walking route",
  },
  cycling: {
    icon: BikeIcon,
    label: "Cycling route",
  },
  driving: {
    icon: CarIcon,
    label: "Driving route",
  },
};

const fetchDirections = async (waypoints: Position[]) => {
  const response = await fetch(
    `/api/places/routing?waypoints=${waypoints.map((w) => w.reverse().join(",")).join("|")}`,
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
  const [linePoints, setLinePoints] = useState<Position[]>([]);

  // const { data: searchResults, isFetching } = useQuery({
  //   enabled: linePoints.length > 1,
  //   queryKey: ["directions", linePoints],
  //   queryFn: () => fetchDirections(linePoints),
  //   retry: false,
  // });

  // console.log(1111, searchResults);

  useEffect(() => {
    if (!map) return;

    if (isActive) {
      map.getCanvas().style.cursor = "crosshair";
    } else {
      map.getCanvas().style.cursor = "";
    }

    return () => {
      map.getCanvas().style.cursor = "";
    };
  }, [isActive, map]);

  useEffect(() => {
    if (!map || !isActive) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      setLinePoints((prev) => [...prev, [lng, lat]]);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, isActive]);

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
      });
    }
  }, [map, verticesGeoJson]);

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

  // Draw basic line
  useEffect(() => {
    if (!map) return;

    const currentLineSource = map.getSource("line-path") as
      | mapboxgl.AnySourceImpl
      | undefined;

    if (currentLineSource) {
      (currentLineSource as mapboxgl.GeoJSONSource).setData(lineGeoJson);
    } else {
      map.addSource("line-path", {
        type: "geojson",
        data: lineGeoJson,
      });

      map.addLayer({
        id: "line-path",
        type: "line",
        source: "line-path",
        paint: {
          "line-color": "#3b82f6",
          "line-width": 3,
        },
      });
    }
  }, [map, lineGeoJson]);

  // useEffect(() => {
  //   if (!map) {
  //     console.log("Map is not initialized");
  //     return;
  //   }

  //   console.log("Search results:", searchResults);
  //   console.log("Map instance:", map);

  //   // Remove existing line source and layer if they exist
  //   if (map.getSource("line-path")) {
  //     console.log("Removing existing line source");
  //     map.removeLayer("line-path");
  //     map.removeSource("line-path");
  //   }

  //   if (searchResults?.results?.[0]?.geometry) {
  //     console.log("Geometry data:", searchResults.results[0].geometry);
  //     // Add new source and layer
  //     map.addSource("line-path", {
  //       type: "geojson",
  //       data: {
  //         type: "FeatureCollection",
  //         features: [
  //           {
  //             type: "Feature",
  //             geometry: {
  //               type: "LineString",
  //               coordinates: searchResults.results[0].geometry.map((point) => {
  //                 if (!point?.[0]) {
  //                   console.log("Invalid point data:", point);
  //                   return [0, 0];
  //                 }
  //                 return [point[0].lon, point[0].lat];
  //               }),
  //             },
  //             properties: {},
  //           },
  //         ],
  //       },
  //     });

  //     console.log("Added source, adding layer");
  //     map.addLayer({
  //       id: "line-path",
  //       type: "line",
  //       source: "line-path",
  //       paint: {
  //         "line-color": "#3b82f6",
  //         "line-width": 3,
  //       },
  //     });
  //     console.log("Layer added successfully");
  //   } else {
  //     console.log("No valid geometry data found in search results");
  //   }

  //   return () => {
  //     console.log("Cleanup - removing line source and layer");
  //     if (map.getSource("line-path")) {
  //       map.removeLayer("line-path");
  //       map.removeSource("line-path");
  //     }
  //   };
  // }, [map, searchResults]);

  return (
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
              return LineTypeIcon ? <LineTypeIcon className="size-5" /> : null;
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
                      <span className="flex-1 truncate text-left">{label}</span>
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
  );
}
