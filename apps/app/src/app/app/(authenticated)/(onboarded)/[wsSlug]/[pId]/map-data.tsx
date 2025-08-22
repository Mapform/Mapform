"use client";

import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/mapbox";
import { useProject } from "./context";
import { rowsToGeoJSON } from "~/lib/rows-to-geojson";
import {
  POINTS_LAYER_ID,
  POINTS_SYMBOLS_LAYER_ID,
  LINES_LAYER_ID,
  POLYGONS_FILL_LAYER_ID,
  POLYGONS_OUTLINE_LAYER_ID,
} from "~/lib/map/constants";

export function MapData() {
  const { projectService } = useProject();

  // Separate rows by geometry type
  const pointRows = useMemo(
    () =>
      projectService.optimisticState.rows.filter(
        (row) => row.geometry.type === "Point",
      ),
    [projectService.optimisticState.rows],
  );
  const lineRows = useMemo(
    () =>
      projectService.optimisticState.rows.filter(
        (row) =>
          row.geometry.type === "LineString" ||
          row.geometry.type === "MultiLineString",
      ),
    [projectService.optimisticState.rows],
  );
  const polygonRows = useMemo(
    () =>
      projectService.optimisticState.rows.filter(
        (row) =>
          row.geometry.type === "Polygon" ||
          row.geometry.type === "MultiPolygon",
      ),
    [projectService.optimisticState.rows],
  );

  return (
    <>
      <Source id="points-source" data={rowsToGeoJSON(pointRows)} type="geojson">
        {/* Basic points layer - always show */}
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
        {/* Emoji markers - only show if flat_icon exists */}
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
