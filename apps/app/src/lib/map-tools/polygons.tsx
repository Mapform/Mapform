import type { FeatureCollection, Position } from "geojson";
import { useEffect, useMemo } from "react";
import type mapboxgl from "mapbox-gl";

// Draws the polygons on the map
export function useDrawShapes({
  map,
  coordinates,
  isVisible = true,
  sourceId = "polygons",
  layerId = "polygons",
  outlineLayerId = "polygons-outline",
}: {
  map?: mapboxgl.Map | null;
  coordinates: Position[][][]; // Array of Polygon coordinates
  isVisible?: boolean;
  sourceId?: string;
  layerId?: string;
  outlineLayerId?: string;
}) {
  // Used for creating polygons on the map
  const polygonsGeoJson = useMemo(
    () =>
      ({
        type: "FeatureCollection",
        features: coordinates.map((polygon, index) => ({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: polygon,
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

    try {
      // Handle polygons layer
      const currentPolygonSource = map.getSource(sourceId) as
        | mapboxgl.AnySourceImpl
        | undefined;

      if (currentPolygonSource) {
        // Update the source data
        (currentPolygonSource as mapboxgl.GeoJSONSource).setData(
          polygonsGeoJson,
        );
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
          data: polygonsGeoJson,
        });

        map.addLayer({
          id: layerId,
          type: "fill",
          source: sourceId,
          layout: {
            visibility: isVisible ? "visible" : "none",
          },
          paint: {
            "fill-color": "#f59e42",
            "fill-opacity": 0.4,
            // "fill-outline-color": "#000000",
          },
        });

        // Add line layer for the outline
        map.addLayer({
          id: outlineLayerId,
          type: "line",
          source: sourceId,
          layout: {},
          paint: {
            "line-color": "#000000",
            "line-width": 3,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [map, polygonsGeoJson, isVisible, sourceId, outlineLayerId, layerId]);
}
