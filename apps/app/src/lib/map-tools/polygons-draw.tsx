"use client";

import { Feature, FeatureCollection, Position } from "geojson";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type mapboxgl from "mapbox-gl";
import { useEffect, useMemo } from "react";

export function usePolygons({
  map,
  coordinates,
}: {
  map?: mapboxgl.Map;
  coordinates: Position[][];
}) {
  console.log("coordinates", coordinates);

  const preloadedFeatures: FeatureCollection = useMemo(
    () => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates,
            type: "Polygon",
          },
        },
      ],
    }),
    [coordinates],
  );

  useEffect(() => {
    if (!map) return;
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    map.addControl(draw);

    console.log("on map load", preloadedFeatures);
    if (draw && preloadedFeatures) {
      draw.add(preloadedFeatures);
      //console.log("all features", draw.getAll());
    }
  }, [map, preloadedFeatures]);
}
