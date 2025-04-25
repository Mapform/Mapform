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
import { useDrawPoints } from "../map-tools/points";
import { useDrawLines } from "../map-tools/lines";
import { useDrawShapes } from "../map-tools/polygons";
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
  const [cursorPosition, setCursorPosition] = useState<Position | null>(null);
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
    setCursorPosition(null);
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

      const currentLineVerticesSource = map.getSource("points") as
        | mapboxgl.AnySourceImpl
        | undefined;

      const currentLineSource = map.getSource("lines") as
        | mapboxgl.AnySourceImpl
        | undefined;

      if (currentLineVerticesSource) {
        map.removeLayer("points");
        map.removeSource("points");
      }

      if (currentLineSource) {
        map.removeLayer("lines");
        map.removeSource("lines");
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
        setCursorPosition(null);
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
    sourceId: "points",
    layerId: "points",
  });

  useDrawLines({
    map,
    coordinates: [linePoints],
    sourceId: "lines",
    layerId: "lines",
    connectStartAndEnd: true,
  });

  useDrawShapes({
    map,
    coordinates: [[linePoints]],
    sourceId: "polygons",
    layerId: "polygons",
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
      map.on("mouseenter", "points", handleVertexMouseEnter);
      map.on("mouseleave", "points", handleVertexMouseLeave);
      map.on("mousedown", "points", handleVertexClick);
      map.on("mousemove", handleMouseMove);
    }

    return () => {
      map.off("mouseenter", "points", handleVertexMouseEnter);
      map.off("mouseleave", "points", handleVertexMouseLeave);
      map.off("mousedown", "points", handleVertexClick);
      map.off("mousemove", handleMouseMove);
    };
  }, [map, isSelecting, draggedPointIndex]);

  // Draw temporary line to cursor
  // useEffect(() => {
  //   if (!map) return;

  //   // Add the source and layer once when the component mounts
  //   if (!map.getSource("temp-line-path")) {
  //     map.addSource("temp-line-path", {
  //       type: "geojson",
  //       data: {
  //         type: "FeatureCollection",
  //         features: [],
  //       },
  //     });

  //     map.addLayer({
  //       id: "temp-line-path",
  //       type: "line",
  //       source: "temp-line-path",
  //       paint: {
  //         "line-color": "#3b82f6",
  //         "line-width": 2,
  //         "line-dasharray": [1, 1],
  //       },
  //     });
  //   }

  //   // Update the source data when cursor position or line points change
  //   if (cursorPosition && linePoints.length > 0) {
  //     const lastPoint = linePoints[linePoints.length - 1];
  //     if (!lastPoint) return;

  //     const tempLineGeoJson = {
  //       type: "FeatureCollection",
  // features: [
  //   {
  //     type: "Feature",
  //     geometry: {
  //       type: "LineString",
  //       coordinates: [lastPoint, cursorPosition] as Position[],
  //     },
  //     properties: {},
  //   },
  // ],
  //     } satisfies FeatureCollection;

  //     (map.getSource("temp-line-path") as mapboxgl.GeoJSONSource).setData(
  //       tempLineGeoJson,
  //     );
  //   } else {
  //     // Clear the line when there's no cursor position or no points
  //     (map.getSource("temp-line-path") as mapboxgl.GeoJSONSource).setData({
  //       type: "FeatureCollection",
  //       features: [],
  //     });
  //   }
  // }, [map, cursorPosition, linePoints]);

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
