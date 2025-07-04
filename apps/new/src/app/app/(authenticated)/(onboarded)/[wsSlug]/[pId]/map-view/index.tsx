"use client";

import { Layer, Map, MapRoot, Source } from "~/components/map";
import { rowsToGeoJSON } from "~/lib/rows-to-geojson";
import { useMemo, useState } from "react";
import { useMediaQuery } from "@mapform/ui/hooks/use-media-query";
import { useProject } from "../context";
import { MapDrawer } from "./map-drawer/index";
import { DRAWER_WIDTH } from "./constants";
import { MapControls } from "./map-controls";
import { PanelLeftOpenIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { cn } from "@mapform/lib/classnames";
import { MapContextMenu } from "./map-context-menu";
import { useParamsContext } from "~/lib/params/client";

const POINTS_LAYER_ID = "points-layer";
const POINTS_SYMBOLS_LAYER_ID = "points-symbols-layer";
const LINES_LAYER_ID = "lines-layer";
const POLYGONS_FILL_LAYER_ID = "polygons-fill-layer";
const POLYGONS_OUTLINE_LAYER_ID = "polygons-outline-layer";

export function MapView() {
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

  return (
    <MapRoot padding={mapPadding}>
      <MapViewInner drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </MapRoot>
  );
}

function MapViewInner({
  drawerOpen,
  setDrawerOpen,
}: {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}) {
  const { projectService } = useProject();
  const { setQueryStates } = useParamsContext();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleClick = (e: mapboxgl.MapMouseEvent) => {
    const features = e.target.queryRenderedFeatures(e.point, {
      layers: [
        POINTS_LAYER_ID,
        POINTS_SYMBOLS_LAYER_ID,
        LINES_LAYER_ID,
        POLYGONS_FILL_LAYER_ID,
      ],
    });

    const feature = features[0];

    if (feature?.properties?.id) {
      setDrawerOpen(true);
      void setQueryStates({ rowId: feature.properties.id as string });
    }
  };

  const handleContextMenu = (e: mapboxgl.MapMouseEvent) => {
    e.preventDefault();

    // Calculate position relative to the container
    const x = e.point.x;
    const y = e.point.y;

    setContextMenuPosition({ x, y });
    setContextMenuOpen(true);
  };

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
    <div className="h-full overflow-hidden p-4">
      <div className="relative h-full overflow-hidden">
        <Map
          className="size-full rounded-lg"
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          {/* Points Layer */}
          <Source id="points-source" data={rowsToGeoJSON(pointRows)}>
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

          {/* Polygons Layer */}
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
        </Map>

        {/* Context Menu */}
        <MapContextMenu
          open={contextMenuOpen}
          onOpenChange={setContextMenuOpen}
          position={contextMenuPosition}
        />

        <Button
          className={cn(
            "absolute left-2 top-2 z-10 transition-opacity delay-300 duration-300",
            {
              "opacity-0": drawerOpen,
              "opacity-100": !drawerOpen,
            },
          )}
          size="icon-sm"
          type="button"
          variant="outline"
          onClick={() => {
            setDrawerOpen(true);
          }}
        >
          <PanelLeftOpenIcon className="size-4" />
        </Button>
        <MapDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
        <MapControls />
      </div>
    </div>
  );
}
