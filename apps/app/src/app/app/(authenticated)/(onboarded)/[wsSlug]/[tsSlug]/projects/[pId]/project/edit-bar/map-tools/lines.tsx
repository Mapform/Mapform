import type { FeatureCollection, Position, Feature, LineString } from "geojson";
import { useEffect, useMemo } from "react";
import type mapboxgl from "mapbox-gl";

// Draws the lines on the map
export function useDrawLines({
  map,
  coordinates,
  isVisible = true,
  sourceId = "lines",
  layerId = "lines",
  connectStartAndEnd = false,
}: {
  map: mapboxgl.Map | null;
  coordinates: Position[][]; // Array of LineString coordinates
  isVisible?: boolean;
  sourceId?: string;
  layerId?: string;
  connectStartAndEnd?: boolean;
}) {
  // Used for creating lines on the map
  const linesGeoJson = useMemo(() => {
    const features: Feature<LineString, any>[] = coordinates.map(
      (line, index) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: line,
        },
        properties: {
          index,
          isLast: index === coordinates.length - 1,
        },
      }),
    );

    // If connectStartAndEnd is true, add a line connecting the first and last point of the first line
    if (
      connectStartAndEnd &&
      coordinates.length > 0 &&
      Array.isArray(coordinates[0]) &&
      coordinates[0].length > 1 &&
      coordinates[0][0] !== undefined &&
      coordinates[0][coordinates[0].length - 1] !== undefined
    ) {
      const firstLine = coordinates[0];
      features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            firstLine[0] as Position,
            firstLine[firstLine.length - 1] as Position,
          ],
        },
        properties: {
          index: -1,
          isLast: false,
          isConnection: true,
        },
      });
    }

    return {
      type: "FeatureCollection",
      features,
    } satisfies FeatureCollection;
  }, [coordinates, connectStartAndEnd]);

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
