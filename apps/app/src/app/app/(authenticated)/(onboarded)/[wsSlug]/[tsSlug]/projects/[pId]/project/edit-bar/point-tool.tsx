import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { MapPinPlusIcon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useMapform } from "~/components/mapform";
import { SearchPopover } from "./search-popover";
import mapboxgl from "mapbox-gl";
import { useReverseGeocode } from "~/hooks/use-reverse-geocode";

interface PointToolProps {
  isActive: boolean;
  isSearchOpen: boolean;
  onClick: () => void;
}

function PointToolInner({
  isActive,
  isSearchOpen,
  onClick,
  map,
}: PointToolProps & { map: mapboxgl.Map }) {
  const [location, setLocation] = useState<mapboxgl.LngLat | null>(null);

  const { isFetching, selectedFeature, refetch } = useReverseGeocode(map);

  const onDrawCreate = useCallback(
    (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      const feature = e.features[0];

      // @ts-expect-error -- The types are wrong
      const coordinates = feature?.geometry.coordinates as [number, number];

      setLocation(new mapboxgl.LngLat(coordinates[0], coordinates[1]));

      void refetch();
    },
    [refetch],
  );

  useEffect(() => {
    let draw: MapboxDraw | undefined;

    if (isActive) {
      draw = new MapboxDraw({
        displayControlsDefault: false,
        defaultMode: "draw_point",
      });
      map.addControl(draw);
      map.on("draw.create", onDrawCreate);
      map.on("draw.update", onDrawCreate);
    }

    return () => {
      if (draw) {
        map.removeControl(draw);
        map.off("draw.create", onDrawCreate);
      }
    };
  }, [isActive, map, onDrawCreate]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size="icon"
            variant={isActive && !isSearchOpen ? "default" : "ghost"}
          >
            <MapPinPlusIcon className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Point tool</TooltipContent>
      </Tooltip>
      {location && (
        <SearchPopover
          location={location}
          selectedFeature={selectedFeature}
          isPending={isFetching}
        ></SearchPopover>
      )}
    </>
  );
}

export function PointTool(props: PointToolProps) {
  const { map } = useMapform();

  if (!map) {
    return null;
  }

  return <PointToolInner {...props} map={map} />;
}
