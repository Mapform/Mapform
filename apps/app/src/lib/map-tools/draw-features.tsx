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

    let ids: string[] = [];

    catchMapErrors(() => {
      ids = draw.add(featureCollection);
    });

    return () => {
      catchMapErrors(() => {
        draw.delete(ids);
      });
    };
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
