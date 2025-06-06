"use client";

import { isPersistedFeature } from "@mapform/backend/data/features/types";
import type { FeatureCollection } from "geojson";
import { useEffect } from "react";
import { useMapform } from "~/components/mapform";

export function useDrawFeatures({
  features = {
    type: "FeatureCollection",
    features: [],
  },
}: {
  features: FeatureCollection;
}) {
  const { map, draw } = useMapform();

  /**
   * Render features using Draw. This makes features editable.
   */
  useEffect(() => {
    if (!map || !draw) return;

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
        if (!feature!.id) return true;

        const existingFeature = draw.get(feature.id.toString());
        if (!existingFeature) return true; // Feature doesn't exist, add it

        // Check if properties have changed
        const existingProps = JSON.stringify(existingFeature.properties);
        const newProps = JSON.stringify(feature.properties);
        if (existingProps !== newProps) {
          // Update the existing feature with new properties
          draw.delete(feature.id.toString());
          return true;
        }

        return false;
      });

      if (newFeatures.length > 0) {
        draw.add({
          type: "FeatureCollection",
          features: newFeatures,
        });
      }
    });
  }, [map, features, draw]);
}

// When changing pages and map unmounts calling function on map or draw can cause errors. Easier to just catch it.
const catchMapErrors = (fn: () => void) => {
  try {
    fn();
  } catch (error) {
    // Do nothing
  }
};
