"use client";

import { useEffect, useMemo } from "react";
import { Layer, Source, useMap } from "react-map-gl/mapbox";
import { useProject } from "./context";
import { rowsToGeoJSON } from "~/lib/rows-to-geojson";
import type { Geometry } from "geojson";
import { loadPointImage } from "~/lib/map/point-image-utils";
import {
  POINTS_LAYER_ID,
  POINTS_SYMBOLS_LAYER_ID,
  LINES_LAYER_ID,
  POLYGONS_FILL_LAYER_ID,
  POLYGONS_OUTLINE_LAYER_ID,
} from "~/lib/map/constants";

export function MapData() {
  const { projectService } = useProject();
  const map = useMap();

  // Separate rows by geometry type
  const pointRows = useMemo(
    () =>
      projectService.optimisticState.rows.filter(
        (row) => (row.geometry as Geometry).type === "Point",
      ),
    [projectService.optimisticState.rows],
  );
  const lineRows = useMemo(
    () =>
      projectService.optimisticState.rows.filter(
        (row) =>
          (row.geometry as Geometry).type === "LineString" ||
          (row.geometry as Geometry).type === "MultiLineString",
      ),
    [projectService.optimisticState.rows],
  );
  const polygonRows = useMemo(
    () =>
      projectService.optimisticState.rows.filter(
        (row) =>
          (row.geometry as Geometry).type === "Polygon" ||
          (row.geometry as Geometry).type === "MultiPolygon",
      ),
    [projectService.optimisticState.rows],
  );

  const iconsToLoad = useMemo(
    () =>
      Array.from(
        new Set(
          pointRows
            .map((row) => (typeof row.icon === "string" ? row.icon : null))
            .filter((v): v is string => Boolean(v)),
        ),
      ),
    [pointRows],
  );

  useEffect(() => {
    const m = map.current;
    if (!m || iconsToLoad.length === 0) return;

    let cancelled = false;
    const run = async () => {
      for (const emoji of iconsToLoad) {
        if (cancelled) return;
        await loadPointImage(m as unknown as mapboxgl.Map, emoji, null);
      }
    };

    if (m.isStyleLoaded()) {
      void run();
    } else {
      const onLoad = () => void run();
      m.once("load", onLoad);
      return () => {
        cancelled = true;
        m.off("load", onLoad);
      };
    }
  }, [iconsToLoad, map]);

  return (
    <>
      <Source id="points-source" data={rowsToGeoJSON(pointRows)} type="geojson">
        {/* Basic points layer - show when no icon is set */}
        <Layer
          id={POINTS_LAYER_ID}
          type="circle"
          filter={["!", ["has", "flat_icon"]]}
          paint={{
            "circle-radius": 8,
            "circle-color": "#3b82f6",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          }}
        />
        {/* Emoji markers - use preloaded images when flat_icon exists */}
        <Layer
          id={POINTS_SYMBOLS_LAYER_ID}
          type="symbol"
          filter={["has", "flat_icon"]}
          layout={{
            "icon-image": ["get", "flat_icon"],
            "icon-size": 0.55,
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "icon-anchor": "center",
            "icon-offset": [0, 3],
          }}
        />
      </Source>

      {/* Lines Layer */}
      <Source id="lines-source" data={rowsToGeoJSON(lineRows)} type="geojson">
        <Layer
          id={LINES_LAYER_ID}
          type="line"
          paint={{
            "line-color": "#10b981",
            "line-width": 3,
            "line-opacity": 0.8,
          }}
        />
      </Source>

      {/* Polygons Layer */}
      <Source
        id="polygons-source"
        data={rowsToGeoJSON(polygonRows)}
        type="geojson"
      >
        <Layer
          id={POLYGONS_FILL_LAYER_ID}
          type="fill"
          paint={{
            "fill-color": "#8b5cf6",
            "fill-opacity": 0.4,
          }}
        />
        <Layer
          id={POLYGONS_OUTLINE_LAYER_ID}
          type="line"
          paint={{
            "line-color": "#7c3aed",
            "line-width": 2,
          }}
        />
      </Source>
    </>
  );
}
