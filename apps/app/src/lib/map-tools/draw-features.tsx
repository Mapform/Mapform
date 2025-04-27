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
