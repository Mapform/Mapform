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

    const ids = draw.add(featureCollection);

    return () => {
      draw.delete(ids);
    };
  }, [map, featureCollection, draw]);
}
