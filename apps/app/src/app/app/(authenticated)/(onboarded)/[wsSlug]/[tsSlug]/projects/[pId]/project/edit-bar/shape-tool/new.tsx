"use client";

import { Button } from "@mapform/ui/components/button";
import { TooltipContent, TooltipTrigger } from "@mapform/ui/components/tooltip";

import { Tooltip } from "@mapform/ui/components/tooltip";
import { PentagonIcon } from "lucide-react";
import { LineToolPopover } from "./popover";
import mapboxgl from "mapbox-gl";
import { useMapform } from "~/components/mapform";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Feature, Position, Polygon } from "geojson";

interface ShapeToolProps {
  isActive: boolean;
  isSearchOpen: boolean;
  onClick: () => void;
}

export function ShapeTool(props: ShapeToolProps) {
  const { isActive, isSearchOpen, onClick } = props;
  const { map, draw } = useMapform();
  const [feature, setFeature] = useState<Feature<Polygon> | null>(null);

  const location = useMemo(
    () => getCenterOfPoints(feature?.geometry.coordinates[0] ?? []),
    [feature],
  );

  console.log("feature", feature);

  const handleModeChange = useCallback(
    (e: { mode: string }) => {
      if (!draw) return;

      if (e.mode === "simple_select") {
        if (feature) {
          try {
            draw.changeMode("direct_select", {
              featureId: feature.id as string,
            });
          } catch (_) {
            draw.changeMode("draw_polygon");
          }
        } else {
          draw.changeMode("draw_polygon");
        }
      }

      // if (e.mode === "static") {
      //   draw.changeMode("static");
      // } else {
      //   if (feature) {
      //     try {
      //       draw.changeMode("direct_select", {
      //         featureId: feature.id as string,
      //       });
      //     } catch (_) {
      //       draw.changeMode("draw_polygon");
      //     }
      //   } else {
      //     draw.changeMode("draw_polygon");
      //   }
      // }
    },
    [draw, feature],
  );

  const handleKeyDown = useCallback(
    (id: string, e: KeyboardEvent) => {
      if (!draw) return;
      if (e.key === "Escape") {
        setFeature(null);
        draw.changeMode("draw_polygon");
        draw.delete(id);
        window.removeEventListener("keydown", handleKeyDown.bind(null, id));
      }
    },
    [draw],
  );

  const handleDrawCreate = useCallback(
    (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      if (!draw) return;

      const feature = e.features[0];

      if (feature?.geometry.type === "Polygon") {
        setFeature(feature as Feature<Polygon>);
        setTimeout(() => {
          draw.changeMode("direct_select", { featureId: feature.id as string });
        }, 0);
        window.addEventListener(
          "keydown",
          handleKeyDown.bind(null, feature.id as string),
        );
      }
    },
    [draw, handleKeyDown],
  );

  useEffect(() => {
    if (!map || !draw) return;

    if (isActive) {
      draw.changeMode("draw_polygon");
      map.on("draw.modechange", handleModeChange);
      map.on("draw.create", handleDrawCreate);
    } else {
      draw.changeMode("static");
      map.off("draw.modechange", handleModeChange);
      map.off("draw.create", handleDrawCreate);
    }
  }, [map, draw, isActive, feature, handleModeChange, handleDrawCreate]);

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
      {location && (
        <LineToolPopover
          location={new mapboxgl.LngLat(location[0]!, location[1]!)}
          onSave={() => {
            if (feature) {
              draw?.delete(feature.id as string);
              setFeature(null);
              draw?.changeMode("draw_polygon");
            }
          }}
          isFetching={false}
          coordinates={feature?.geometry.coordinates as Position[][]}
        />
      )}
    </>
  );
}

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
