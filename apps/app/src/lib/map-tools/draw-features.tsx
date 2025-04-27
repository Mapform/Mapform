"use client";

import type { FeatureCollection } from "geojson";
import type mapboxgl from "mapbox-gl";
import { useEffect } from "react";
import { useMapform } from "~/components/mapform";

export function useDrawFeatures({
  map,
  featureCollection,
}: {
  map?: mapboxgl.Map;
  featureCollection: FeatureCollection;
}) {
  const { draw } = useMapform();

  useEffect(() => {
    if (!map || !draw) return;

    catchMapErrors(() => {
      // Get all existing feature IDs from the map
      const existingFeatureIds = new Set(
        draw.getAll().features.map((f) => f.id?.toString()),
      );

      // Get all feature IDs from the incoming collection
      const newFeatureIds = new Set(
        featureCollection.features.map((f) => f.id?.toString()),
      );

      // Delete features that exist in the map but not in the new collection
      existingFeatureIds.forEach((id) => {
        if (id && !newFeatureIds.has(id)) {
          draw.delete(id);
        }
      });

      // Filter out features that already exist
      const newFeatures = featureCollection.features.filter((feature) => {
        if (!feature.id) return true; // If no ID, we'll add it
        return !draw.get(feature.id.toString()); // Check if feature exists
      });

      // Only add new features
      if (newFeatures.length > 0) {
        draw.add({
          type: "FeatureCollection",
          features: newFeatures,
        });
      }
    });
  }, [map, featureCollection, draw]);
}

// When changing pages and map unmounts calling function on map or draw can cause errors. Easier to just catch it.
const catchMapErrors = (fn: () => void) => {
  try {
    fn();
  } catch (error) {
    // Do nothing
  }
};
