"use client";

import type { GetFeatures } from "@mapform/backend/data/features/get-features";
import { isPersistedFeature } from "@mapform/backend/data/features/types";
import type { Feature, FeatureCollection } from "geojson";
import type mapboxgl from "mapbox-gl";
import { useEffect } from "react";
import { useMapform } from "~/components/mapform";

export function useDrawFeatures({
  map,
  features = {
    type: "FeatureCollection",
    features: [],
  },
  isStatic = false,
}: {
  map?: mapboxgl.Map;
  features: GetFeatures["data"];
  isStatic?: boolean;
}) {
  const { draw } = useMapform();

  /**
   * Render features with Mapbox GL JS Layers. This is used for static maps.
   */
  useEffect(() => {
    if (!map || !isStatic) return;

    catchMapErrors(() => {
      const currentSource = map.getSource("features") as
        | mapboxgl.AnySourceImpl
        | undefined;

      if (currentSource) {
        // Update the source data
        (currentSource as mapboxgl.GeoJSONSource).setData(
          features as FeatureCollection,
        );
      } else {
        // Add a new source and layer
        map.addSource("features", {
          type: "geojson",
          data: features as FeatureCollection,
        });

        // Add outer circle for points
        map.addLayer({
          id: "features-point-outer",
          type: "circle",
          filter: ["all", ["==", "$type", "Point"]],
          source: "features",
          paint: {
            "circle-radius": 7,
            "circle-color": "#fff",
          },
        });

        // Add inner circle for points
        map.addLayer({
          id: "features-point-inner",
          type: "circle",
          filter: ["all", ["==", "$type", "Point"]],
          source: "features",
          paint: {
            "circle-radius": 5,
            "circle-color": ["get", "color"],
          },
        });

        // Add polygon fill layer
        map.addLayer({
          id: "features-polygon-fill",
          type: "fill",
          filter: ["all", ["==", "$type", "Polygon"]],
          source: "features",
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": 0.1,
          },
        });

        // Add lines and polygon outlines layer
        map.addLayer({
          id: "features-lines",
          type: "line",
          filter: [
            "any",
            ["==", "$type", "LineString"],
            ["==", "$type", "Polygon"],
          ],
          source: "features",
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": ["get", "color"],
            "line-dasharray": [2, 0],
            "line-width": 2,
          },
        });
      }
    });
  }, [map, isStatic, features]);

  /**
   * Render features using Draw. This makes features editable.
   */
  useEffect(() => {
    if (!map || !draw || isStatic) return;

    catchMapErrors(() => {
      // Get all existing feature IDs from the draw tool that are persisted (ie.
      // we ignore features that are being drawn)
      const existingFeatures = draw
        .getAll()
        .features.filter((f) => isPersistedFeature(f));
      const existingFeatureIds = new Set(
        existingFeatures.map((f) => f.id as string),
      );

      // Get all incoming feature IDs
      const incomingFeatureIds = new Set(
        features.features
          .map((f) => f?.id)
          .filter((id): id is string => typeof id === "string"),
      );

      // Batch delete features that no longer exist
      const featuresToDelete = Array.from(existingFeatureIds).filter(
        (id) => !incomingFeatureIds.has(id),
      );
      if (featuresToDelete.length > 0) {
        draw.delete(featuresToDelete);
      }

      // Filter out features that haven't changed
      const newFeatures = features.features.filter((feature) => {
        if (!feature?.id) return true;

        const existingFeature = draw.get(feature.id);
        if (!existingFeature) return true; // Feature doesn't exist, add it

        // Check if properties have changed
        const existingProps = JSON.stringify(existingFeature.properties);
        const newProps = JSON.stringify(feature.properties);
        if (existingProps !== newProps) {
          // Update the existing feature with new properties
          draw.delete(feature.id);
          return true;
        }

        return false;
      }) as Feature[];

      if (newFeatures.length > 0) {
        draw.add({
          type: "FeatureCollection",
          features: newFeatures,
        });
      }
    });
  }, [map, features, draw, isStatic]);
}

// When changing pages and map unmounts calling function on map or draw can cause errors. Easier to just catch it.
const catchMapErrors = (fn: () => void) => {
  try {
    fn();
  } catch (error) {
    // Do nothing
  }
};
