import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import type { GeoapifyRoute } from "@mapform/map-utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { FeatureCollection, Position } from "geojson";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMapform } from "~/components/mapform";
import { useDrawLines } from "./draw-lines";
import { useDrawPoints } from "./draw-points";

const fetchDirections = async (
  waypoints: Position[],
  selectedLineType: "drive" | "bicycle" | "walk",
) => {
  const response = await fetch(
    `/api/places/routing?waypoints=${waypoints.map((w) => `lonlat:${w.join(",")}`).join("|")}&mode=${selectedLineType}`,
  );
  const json = await response.json();
  return json.data as GeoapifyRoute;
};

export function useDrawDirections({
  drawMode,
  isActive,
}: {
  features: FeatureCollection;
  drawMode: "drive" | "bicycle" | "walk" | null;
  isActive: boolean;
}) {
  const { map } = useMapform();
  const queryClient = useQueryClient();
  const [routeVertices, setRouteVertices] = useState<Position[]>([]);

  const debouncedRouteVertices = useDebounce(routeVertices, 200);

  const { data: directions, isFetching } = useQuery({
    enabled: debouncedRouteVertices.length > 1 && drawMode !== null,
    queryKey: ["directions", drawMode, ...debouncedRouteVertices],
    queryFn: () => fetchDirections(debouncedRouteVertices, drawMode!),
    retry: false,
  });

  const resetRouteTool = useCallback(() => {
    setRouteVertices([]);
    queryClient.removeQueries({ queryKey: ["directions"] });
  }, [queryClient]);

  // Handle map events for adding vertices
  useEffect(() => {
    if (!map || !drawMode) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (!isActive) return;
      const { lng, lat } = e.lngLat;
      setRouteVertices((prev) => [...prev, [lng, lat]]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (map) {
          map.getCanvas().style.cursor = "";
        }
      } else if (e.key === "Escape") {
        if (isActive) {
          resetRouteTool();
        } else {
          if (map) {
            map.getCanvas().style.cursor = "crosshair";
          }
        }
      } else if (e.key === "Backspace") {
        if (isActive) {
          setRouteVertices((prev) => prev.slice(0, -1));
        } else {
          resetRouteTool();
        }
      }
    };

    map.on("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      map.off("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [map, drawMode, isActive, resetRouteTool]);

  // Update cursor style
  useEffect(() => {
    if (!map || !drawMode) return;

    if (isActive) {
      map.getCanvas().style.cursor = "crosshair";
    } else {
      map.getCanvas().style.cursor = "";
    }

    return () => {
      if (!map.isStyleLoaded()) return;
      map.getCanvas().style.cursor = "";
    };
  }, [map, drawMode, isActive]);

  const coordinates = useMemo(() => {
    return [
      (directions?.results[0]?.geometry.flatMap((r) => r) ?? []).map((c) => [
        c.lon,
        c.lat,
      ]),
    ];
  }, [directions]);

  useDrawLines({
    map: map ?? null,
    coordinates,
    isVisible: true,
    sourceId: "route-source",
    layerId: "route-layer",
    isActive,
    paint: {
      "line-color": "#f59e0b",
      "line-dasharray": [2, 1],
      "line-width": 4,
    },
  });

  const firstPoint = coordinates[0]?.[0] ?? routeVertices[0];
  const lastPoint = isFetching
    ? routeVertices[routeVertices.length - 1]
    : coordinates[0]?.[coordinates[0]?.length - 1] ??
      routeVertices[routeVertices.length - 1];

  useDrawPoints({
    map: map ?? null,
    points: [
      ...(firstPoint ? [firstPoint] : []),
      ...(lastPoint ? [lastPoint] : []),
    ],
    isVisible: true,
    sourceId: "route-points-source",
    layerId: "route-points-layer",
    isActive,
  });

  return {
    routeVertices,
    directions,
    isFetching,
    resetRouteTool,
  };
}
