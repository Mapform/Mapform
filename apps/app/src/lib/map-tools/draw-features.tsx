"use client";

import type { FeatureCollection } from "geojson";
import type mapboxgl from "mapbox-gl";
import { useEffect } from "react";
import { useMapform } from "~/components/mapform";

// Calculate a checksum for a feature by stringifying its properties and geometry
const calculateFeatureChecksum = (feature: GeoJSON.Feature): string => {
  const { properties, geometry } = feature;
  return JSON.stringify({ properties, geometry });
};

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
      // Filter out features that haven't changed
      const newFeatures = featureCollection.features.filter((feature) => {
        if (!feature.id) return true; // If no ID, we'll add it

        const existingFeature = draw.get(feature.id.toString());
        if (!existingFeature) return true; // Feature doesn't exist, add it

        // Compare checksums to see if feature has changed
        const existingChecksum = calculateFeatureChecksum(existingFeature);
        const newChecksum = calculateFeatureChecksum(feature);
        return existingChecksum !== newChecksum;
      });

      // Only add new or modified features
      if (newFeatures.length > 0) {
        draw.add({
          type: "FeatureCollection",
          features: newFeatures,
        });
      }

      // TODO: Delete features that exist in the map but not in the new
      // collection. NOTE: Exception is when the feature is currently being
      // drawn.
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
