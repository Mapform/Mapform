"use client";

import { Layer, Map, MapRoot, Source } from "~/components/map";
import { rowsToGeoJSON } from "~/lib/rows-to-geojson";
import { useMemo, useRef, useState } from "react";
import { useMediaQuery } from "@mapform/ui/hooks/use-media-query";
import { useProject } from "../context";
import { MapDrawer } from "./map-drawer/index";
import { DRAWER_WIDTH } from "./constants";
import { MapControls } from "./map-controls";

const POINTS_LAYER_ID = "points-layer";
const LINES_LAYER_ID = "lines-layer";
const POLYGONS_FILL_LAYER_ID = "polygons-fill-layer";
const POLYGONS_OUTLINE_LAYER_ID = "polygons-outline-layer";

export function MapView() {
  const { project, setSelectedFeature } = useProject();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleClick = (e: mapboxgl.MapMouseEvent) => {
    const features = e.target.queryRenderedFeatures(e.point, {
      layers: [POINTS_LAYER_ID, LINES_LAYER_ID, POLYGONS_FILL_LAYER_ID],
    });

    const feature = features[0];

    if (feature?.properties?.id) {
      setSelectedFeature(feature.properties.id as string);
    }
  };

  return (
    <MapRoot padding={mapPadding}>
      <div className="h-full overflow-hidden p-4">
        <div className="relative h-full overflow-hidden" ref={containerRef}>
          <Map className="size-full rounded-lg" onClick={handleClick}>
            {/* Points Layer */}
            {pointRows.length > 0 && (
              <Source id="points-source" data={rowsToGeoJSON(pointRows)}>
                <Layer
                  id={POINTS_LAYER_ID}
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
                  id={LINES_LAYER_ID}
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
            )}
          </Map>
          <MapDrawer
            containerRef={containerRef}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
          <MapControls />
        </div>
      </div>
    </MapRoot>
  );
}
