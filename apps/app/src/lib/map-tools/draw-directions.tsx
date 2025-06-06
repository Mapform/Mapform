import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import type { GeoapifyRoute } from "@mapform/map-utils/types";
import { useQuery } from "@tanstack/react-query";
import type { FeatureCollection, Position } from "geojson";
import { useCallback, useEffect, useState } from "react";
import { useMapform } from "~/components/mapform";
import { useDrawFeatures } from "~/lib/map-tools/draw-features";

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

  // Render features and route
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;

    // Add or update the route source
    const routeSource = map.getSource("route-source");
    if (routeSource) {
      (routeSource as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: [
          ...features.features,
          ...(directions?.results[0]?.geometry?.[0]
            ? [
                {
                  type: "Feature" as const,
                  properties: {},
                  geometry: {
                    type: "LineString" as const,
                    coordinates: directions.results[0].geometry[0].map((c) => [
                      c.lon,
                      c.lat,
                    ]),
                  },
                },
              ]
            : []),
        ],
      });
    } else {
      map.addSource("route-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            ...features.features,
            ...(directions?.results[0]?.geometry?.[0]
              ? [
                  {
                    type: "Feature" as const,
                    properties: {},
                    geometry: {
                      type: "LineString" as const,
                      coordinates: directions.results[0].geometry[0].map(
                        (c) => [c.lon, c.lat],
                      ),
                    },
                  },
                ]
              : []),
          ],
        },
      });

      // Add the route layer
      map.addLayer({
        id: "route-layer",
        type: "line",
        source: "route-source",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#0080ff",
          "line-width": 4,
        },
      });
    }

    return () => {
      if (map.getLayer("route-layer")) {
        map.removeLayer("route-layer");
      }
      if (map.getSource("route-source")) {
        map.removeSource("route-source");
      }
    };
  }, [map, features, directions]);

  return {
    routeVertices,
    isSelecting,
    directions,
    isFetching,
    resetRouteTool,
  };
}
