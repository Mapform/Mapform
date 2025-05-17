import type { FeatureCollection, Position } from "geojson";
import { useEffect, useMemo } from "react";

// Draws the points on the map
export function useDrawPoints({
  map,
  points,
  isVisible = true,
  sourceId = "points",
  layerId = "points",
}: {
  map: mapboxgl.Map | null;
  points: Position[];
  isVisible?: boolean;
  sourceId?: string;
  layerId?: string;
}) {
  // Used for creating points on the map
  const pointsGeoJson = useMemo(
    () =>
      ({
        type: "FeatureCollection",
        features: points.map((point, index) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: point,
          },
          properties: {
            index,
            isLast: index === points.length - 1,
          },
        })),
      }) satisfies FeatureCollection,
    [points],
  );

  // Line Vertices
  useEffect(() => {
    if (!map) return;

    try {
      // Handle points layer
      const currentPointSource = map.getSource(sourceId) as
        | mapboxgl.AnySourceImpl
        | undefined;

      if (currentPointSource) {
        // Update the source data
        (currentPointSource as mapboxgl.GeoJSONSource).setData(pointsGeoJson);
        // Update layer visibility
        map.setLayoutProperty(
          layerId,
          "visibility",
          isVisible ? "visible" : "none",
        );
      } else {
        // Only add the source and layer if they don't exist
        map.addSource(sourceId, {
          type: "geojson",
          data: pointsGeoJson,
        });

        map.addLayer({
          id: layerId,
          type: "circle",
          source: sourceId,
          layout: {
            visibility: isVisible ? "visible" : "none",
          },
          paint: {
            "circle-radius": 5,
            "circle-color": [
              "case",
              ["==", ["get", "isLast"], true],
              "#3b82f6",
              "#ffffff",
            ],
            "circle-stroke-color": [
              "case",
              ["==", ["get", "isLast"], true],
              "#ffffff",
              "#3b82f6",
            ],
            "circle-stroke-width": 2,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [map, pointsGeoJson, isVisible, sourceId, layerId]);
}
