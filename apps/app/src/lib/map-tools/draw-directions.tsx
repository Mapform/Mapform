import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import type { GeoapifyRoute } from "@mapform/map-utils/types";
import { useQuery } from "@tanstack/react-query";
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
  features = {
    type: "FeatureCollection",
    features: [],
  },
  drawMode,
}: {
  features: FeatureCollection;
  drawMode: "drive" | "bicycle" | "walk" | null;
}) {
  const { map } = useMapform();
  const [routeVertices, setRouteVertices] = useState<Position[]>([]);
  const [isSelecting, setIsSelecting] = useState(true);

  const debouncedRouteVertices = useDebounce(routeVertices, 200);

  const { data: directions, isFetching } = useQuery({
    enabled: debouncedRouteVertices.length > 1 && drawMode !== null,
    queryKey: ["directions", drawMode, ...debouncedRouteVertices],
    queryFn: () => fetchDirections(debouncedRouteVertices, drawMode!),
    retry: false,
    placeholderData: (prev) => prev,
  });

  const resetRouteTool = useCallback(() => {
    setRouteVertices([]);
    setIsSelecting(true);
    if (map) {
      map.getCanvas().style.cursor = "crosshair";
    }
  }, [map]);

  console.log(1111, routeVertices);
  console.log(2222, directions);

  // Handle map events for adding vertices
  useEffect(() => {
    if (!map || !drawMode) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (!isSelecting) return;
      const { lng, lat } = e.lngLat;
      setRouteVertices((prev) => [...prev, [lng, lat]]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsSelecting(false);
        if (map) {
          map.getCanvas().style.cursor = "";
        }
      } else if (e.key === "Escape") {
        if (isSelecting) {
          resetRouteTool();
        } else {
          setIsSelecting(true);
          if (map) {
            map.getCanvas().style.cursor = "crosshair";
          }
        }
      } else if (e.key === "Backspace") {
        if (isSelecting) {
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
  }, [map, drawMode, isSelecting, resetRouteTool]);

  // Update cursor style
  useEffect(() => {
    if (!map || !drawMode) return;

    if (isSelecting) {
      map.getCanvas().style.cursor = "crosshair";
    } else {
      map.getCanvas().style.cursor = "";
    }

    return () => {
      if (!map.isStyleLoaded()) return;
      map.getCanvas().style.cursor = "";
    };
  }, [map, drawMode, isSelecting]);

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
  });

  return {
    routeVertices,
    isSelecting,
    directions,
    isFetching,
    resetRouteTool,
  };
}
