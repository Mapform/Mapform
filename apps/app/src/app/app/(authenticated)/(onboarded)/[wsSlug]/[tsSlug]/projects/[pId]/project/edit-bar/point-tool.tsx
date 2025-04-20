import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { MapPinPlusIcon } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useMapform } from "~/components/mapform";
import { SearchPopover } from "./search-popover";
import mapboxgl from "mapbox-gl";
import { useReverseGeocode } from "~/hooks/use-reverse-geocode";
import { se } from "date-fns/locale";

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
  const drawRef = useRef<MapboxDraw | null>(null);
  const [location, setLocation] = useState<mapboxgl.LngLat | null>(null);

  const { isFetching, selectedFeature, refetch } = useReverseGeocode(map);

  const onDrawCreate = useCallback(
    (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      console.log("onDrawCreate", e);
      const feature = e.features[0];

      // @ts-expect-error -- The types are wrong
      const coordinates = feature?.geometry.coordinates as [number, number];

      setLocation(new mapboxgl.LngLat(coordinates[0], coordinates[1]));

      void refetch();
    },
    [refetch],
  );

  const onDrawSelectionChange = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      if (!e.features?.length && drawRef.current) {
        map.removeControl(drawRef.current);
        map.off("draw.create", onDrawCreate);
        map.off("draw.update", onDrawCreate);
        map.off("draw.selectionchange", onDrawSelectionChange);
        drawRef.current = null;
        setLocation(null);

        // INITIATE
        const draw = new MapboxDraw({
          displayControlsDefault: false,
          defaultMode: "draw_point",
        });
        drawRef.current = draw;
        map.on("draw.create", onDrawCreate);
        map.on("draw.update", onDrawCreate);
        map.on("draw.selectionchange", onDrawSelectionChange);
        map.addControl(draw);
      }
    },
    [map, onDrawCreate],
  );

  useEffect(() => {
    if (isActive) {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        defaultMode: "draw_point",
      });
      drawRef.current = draw;
      map.addControl(draw);
      map.on("draw.create", onDrawCreate);
      map.on("draw.update", onDrawCreate);
      map.on("draw.selectionchange", onDrawSelectionChange);
    }

    return () => {
      if (drawRef.current) {
        map.removeControl(drawRef.current);
        map.off("draw.create", onDrawCreate);
        map.off("draw.update", onDrawCreate);
        map.off("draw.selectionchange", onDrawSelectionChange);
        drawRef.current = null;
      }
    };
  }, [isActive, map, onDrawCreate, onDrawSelectionChange]);

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
