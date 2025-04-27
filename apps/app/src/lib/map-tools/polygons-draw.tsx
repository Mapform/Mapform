"use client";

import { Feature, FeatureCollection, Position } from "geojson";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef } from "react";
import StaticMode from "@mapbox/mapbox-gl-draw-static-mode";

export function usePolygons({
  map,
  coordinates,
}: {
  map?: mapboxgl.Map;
  coordinates: Position[][];
}) {
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (!map) return;

    const modes = MapboxDraw.modes;
    modes.static = StaticMode;
    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      modes,
      controls: {
        polygon: false,
        trash: false,
      },
      defaultMode: "static",
    });
    map.addControl(drawRef.current);

    return () => {
      if (drawRef.current) {
        map.removeControl(drawRef.current);
        drawRef.current = null;
      }
    };
  }, [map]);

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
    if (!map || !drawRef.current) return;

    const ids = drawRef.current.add(preloadedFeatures);

    return () => {
      drawRef.current?.delete(ids);
    };
  }, [map, preloadedFeatures]);
}
