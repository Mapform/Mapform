"use client";

import { Layer, Map, MapRoot, Source } from "~/components/map";
import { rowsToGeoJSON } from "~/lib/rows-to-geojson";
import { useMemo, useState } from "react";
import { useMediaQuery } from "@mapform/ui/hooks/use-media-query";
import { useProject } from "../context";
import { MapDrawer } from "./map-drawer";
import { DRAWER_WIDTH } from "./contants";

export function MapView() {
  const { project } = useProject();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [drawerOpen, setDrawerOpen] = useState(true);

  const mapPadding = useMemo(() => {
    return {
      top: 0,
      bottom: isDesktop ? 0 : drawerOpen ? 200 : 0,
      left: drawerOpen ? DRAWER_WIDTH : 0,
      right: 0,
    };
  }, [drawerOpen, isDesktop]);

  // Separate rows by geometry type
  const pointRows = useMemo(
    () => project.rows.filter((row) => row.geometry.type === "Point"),
    [project.rows],
  );
  const lineRows = useMemo(
    () =>
      project.rows.filter(
        (row) =>
          row.geometry.type === "LineString" ||
          row.geometry.type === "MultiLineString",
      ),
    [project.rows],
  );
  const polygonRows = useMemo(
    () =>
      project.rows.filter(
        (row) =>
          row.geometry.type === "Polygon" ||
          row.geometry.type === "MultiPolygon",
      ),
    [project.rows],
  );

  return (
    <MapRoot padding={mapPadding}>
      <div className="h-full p-4">
        <div className="relative h-full overflow-hidden">
          <Map className="size-full rounded-lg">
            {/* Points Layer */}
            {pointRows.length > 0 && (
              <Source id="points-source" data={rowsToGeoJSON(pointRows)}>
                <Layer
                  id="points-layer"
                  type="circle"
                  paint={{
                    "circle-radius": 8,
                    "circle-color": "#3b82f6",
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                  }}
                />
              </Source>
            )}

            {/* Lines Layer */}
            {lineRows.length > 0 && (
              <Source id="lines-source" data={rowsToGeoJSON(lineRows)}>
                <Layer
                  id="lines-layer"
                  type="line"
                  paint={{
                    "line-color": "#10b981",
                    "line-width": 3,
                    "line-opacity": 0.8,
                  }}
                />
              </Source>
            )}

            {/* Polygons Layer */}
            {polygonRows.length > 0 && (
              <Source id="polygons-source" data={rowsToGeoJSON(polygonRows)}>
                <Layer
                  id="polygons-fill-layer"
                  type="fill"
                  paint={{
                    "fill-color": "#8b5cf6",
                    "fill-opacity": 0.4,
                  }}
                />
                <Layer
                  id="polygons-outline-layer"
                  type="line"
                  paint={{
                    "line-color": "#7c3aed",
                    "line-width": 2,
                  }}
                />
              </Source>
            )}
          </Map>
          <MapDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
        </div>
      </div>
    </MapRoot>
  );
}
