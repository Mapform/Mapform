import type { FeatureCollection, Position } from "geojson";
import { useEffect, useMemo } from "react";
import type mapboxgl from "mapbox-gl";

// Draws the lines on the map
export function useDrawLines({
  map,
  coordinates,
  isVisible = true,
  sourceId = "lines",
  layerId = "lines",
}: {
  map: mapboxgl.Map | null;
  coordinates: Position[][]; // Array of LineString coordinates
  isVisible?: boolean;
  sourceId?: string;
  layerId?: string;
}) {
  // Used for creating lines on the map
  const linesGeoJson = useMemo(
    () =>
      ({
        type: "FeatureCollection",
        features: coordinates.map((line, index) => ({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: line,
          },
          properties: {
            index,
            isLast: index === coordinates.length - 1,
          },
        })),
      }) satisfies FeatureCollection,
    [coordinates],
  );

  useEffect(() => {
    if (!map) return;

    // Handle lines layer
    const currentLineSource = map.getSource(sourceId) as
      | mapboxgl.AnySourceImpl
      | undefined;

    if (currentLineSource) {
      // Update the source data
      (currentLineSource as mapboxgl.GeoJSONSource).setData(linesGeoJson);
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
        data: linesGeoJson,
      });

      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {
          visibility: isVisible ? "visible" : "none",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
        },
      });
    }
  }, [map, linesGeoJson, isVisible, sourceId, layerId]);
}
