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

  return (
    <>
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                onClick();
                draw?.changeMode("draw_polygon");
              }}
              size="icon"
              variant={isActive && !isSearchOpen ? "default" : "ghost"}
            >
              <PentagonIcon className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Shape tool</TooltipContent>
        </Tooltip>
      </div>
      {/* {location && (
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
      )} */}
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
