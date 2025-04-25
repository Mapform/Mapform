import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { PentagonIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMapform } from "~/components/mapform";
import type { Position } from "geojson";
import mapboxgl from "mapbox-gl";
import { LineToolPopover } from "./popover";
import { useDrawPoints } from "~/lib/map-tools/points";
import { useDrawLines } from "~/lib/map-tools/lines";
import { useDrawShapes } from "~/lib/map-tools/polygons";

const POINT_LAYER_ID = "line-tool-points";
const POINT_SOURCE_ID = "line-tool-points";
const LINE_LAYER_ID = "shape-tool-lines";
const LINE_SOURCE_ID = "shape-tool-lines";
const POLYGON_LAYER_ID = "shape-tool-polygons";
const POLYGON_SOURCE_ID = "shape-tool-polygons";

interface LineToolProps {
  isActive: boolean;
  isSearchOpen: boolean;
  onClick: () => void;
}

export function ShapeTool(props: LineToolProps) {
  const { map } = useMapform();

  if (!map) return null;

  return <ShapeToolInner {...props} map={map} />;
}

function ShapeToolInner({
  map,
  isActive,
  isSearchOpen,
  onClick,
}: LineToolProps & { map: mapboxgl.Map }) {
  const [isSelecting, setIsSelecting] = useState(true);
  const [linePoints, setLinePoints] = useState<Position[]>([]);
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(
    null,
  );

  const getCenterOfPoints = (points: Position[]): Position | null => {
    if (points.length === 0) return null;

    const sum = points.reduce<{ lng: number; lat: number }>(
      (acc, point) => {
        const [lng, lat] = point as [number, number];
        acc.lng += lng;
        acc.lat += lat;
        return acc;
      },
      { lng: 0, lat: 0 },
    );

    return [sum.lng / points.length, sum.lat / points.length];
  };

  const location = useMemo(() => getCenterOfPoints(linePoints), [linePoints]);

  const resetLineTool = useCallback(() => {
    setLinePoints([]);
    setIsSelecting(true);
    map.getCanvas().style.cursor = "crosshair";
  }, [map]);

  useEffect(() => {
    if (isActive) {
      map.getCanvas().style.cursor = "crosshair";
    } else {
      map.getCanvas().style.cursor = "";
    }

    return () => {
      // Prevent cleanup if map is destroyed
      if ((map as unknown as { _removed: boolean })._removed) return;

      const currentLineVerticesSource = map.getSource(POINT_SOURCE_ID) as
        | mapboxgl.AnySourceImpl
        | undefined;

      const currentLineSource = map.getSource(LINE_SOURCE_ID) as
        | mapboxgl.AnySourceImpl
        | undefined;

      const currentPolygonSource = map.getSource(POLYGON_SOURCE_ID) as
        | mapboxgl.AnySourceImpl
        | undefined;

      if (currentLineVerticesSource) {
        map.removeLayer(POINT_LAYER_ID);
        map.removeSource(POINT_SOURCE_ID);
      }

      if (currentLineSource) {
        map.removeLayer(LINE_LAYER_ID);
        map.removeSource(LINE_SOURCE_ID);
      }

      if (currentPolygonSource) {
        map.removeLayer(POLYGON_LAYER_ID);
        map.removeSource(POLYGON_SOURCE_ID);
      }
    };
  }, [isActive, map]);

  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (!isSelecting) return; // Only allow clicking to add points when in selecting mode
      const { lng, lat } = e.lngLat;
      setLinePoints((prev) => [...prev, [lng, lat]]);
    };

    const handleMouseUp = (e: mapboxgl.MapMouseEvent) => {
      if (draggedPointIndex !== null) {
        e.preventDefault();
        setDraggedPointIndex(null);
        map.getCanvas().style.cursor = "move";
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsSelecting(false);
        map.getCanvas().style.cursor = "";
      } else if (e.key === "Escape") {
        if (isSelecting) {
          resetLineTool();
        } else {
          setIsSelecting(true);
          map.getCanvas().style.cursor = "crosshair";
        }
      } else if (e.key === "Backspace") {
        if (isSelecting) {
          setLinePoints((prev) => prev.slice(0, -1));
        } else {
          resetLineTool();
        }
      }
    };

    map.on("click", handleClick);
    map.on("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      map.off("click", handleClick);
      map.off("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    map,
    isActive,
    isSelecting,
    linePoints,
    draggedPointIndex,
    resetLineTool,
  ]);

  useDrawPoints({
    map,
    points: linePoints,
    isVisible: isSelecting,
    sourceId: POINT_SOURCE_ID,
    layerId: POINT_LAYER_ID,
  });

  useDrawLines({
    map,
    coordinates: [linePoints],
    sourceId: LINE_SOURCE_ID,
    layerId: LINE_LAYER_ID,
    connectStartAndEnd: true,
  });

  useDrawShapes({
    map,
    coordinates: [[linePoints]],
    sourceId: POLYGON_SOURCE_ID,
    layerId: POLYGON_LAYER_ID,
  });

  // Add vertex click handler and cursor styles
  useEffect(() => {
    const handleVertexMouseEnter = (e: mapboxgl.MapMouseEvent) => {
      if (isSelecting) {
        e.preventDefault();
        map.getCanvas().style.cursor = "move";
      }
    };

    const handleVertexMouseLeave = (e: mapboxgl.MapMouseEvent) => {
      console.log("handleVertexMouseLeave");
      if (isSelecting) {
        e.preventDefault();
        map.getCanvas().style.cursor = "crosshair";
      }
    };

    const handleVertexClick = (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[];
      },
    ) => {
      const index = e.features?.[0]?.properties?.index as number | undefined;

      if (index === undefined || index < 0 || !isSelecting) return;

      e.preventDefault();
      setDraggedPointIndex(index);
      map.getCanvas().style.cursor = "grabbing";
    };

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (isSelecting && draggedPointIndex !== null) {
        e.preventDefault();
        const { lng, lat } = e.lngLat;
        setLinePoints((prev) => {
          const newPoints = [...prev];
          newPoints[draggedPointIndex] = [lng, lat];
          return newPoints;
        });
      }
    };

    if (isSelecting) {
      map.on("mouseenter", POINT_LAYER_ID, handleVertexMouseEnter);
      map.on("mouseleave", POINT_LAYER_ID, handleVertexMouseLeave);
      map.on("mousedown", POINT_LAYER_ID, handleVertexClick);
      map.on("mousemove", handleMouseMove);
    }

    return () => {
      map.off("mouseenter", POINT_LAYER_ID, handleVertexMouseEnter);
      map.off("mouseleave", POINT_LAYER_ID, handleVertexMouseLeave);
      map.off("mousedown", POINT_LAYER_ID, handleVertexClick);
      map.off("mousemove", handleMouseMove);
    };
  }, [map, isSelecting, draggedPointIndex]);

  return (
    <>
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              size="icon"
              variant={isActive && !isSearchOpen ? "default" : "ghost"}
            >
              <PentagonIcon className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Shape tool</TooltipContent>
        </Tooltip>
      </div>
      {location && !isSelecting && (
        <LineToolPopover
          location={new mapboxgl.LngLat(location[0]!, location[1]!)}
          onSave={resetLineTool}
          isFetching={false}
          coordinates={[
            linePoints.map((p) => [p[0]!, p[1]!] as [number, number]),
          ]}
        />
      )}
    </>
  );
}
