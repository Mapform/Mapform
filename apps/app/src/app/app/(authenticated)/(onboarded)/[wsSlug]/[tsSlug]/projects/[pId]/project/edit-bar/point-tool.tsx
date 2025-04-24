import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { BookmarkIcon, MapPinPlusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
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
  const drawRef = useRef<MapboxDraw | null>(null);
  const searchPopoverRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<mapboxgl.LngLat | null>(null);

  const { isFetching, selectedFeature } = useReverseGeocode({
    lat: location?.lat ?? null,
    lng: location?.lng ?? null,
  });

  const onDrawCreate = useCallback(
    (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      console.log("onDrawCreate", e);
      const feature = e.features[0];

      // @ts-expect-error -- The types are wrong
      const coordinates = feature?.geometry.coordinates as [number, number];

      setLocation(new mapboxgl.LngLat(coordinates[0], coordinates[1]));
    },
    [],
  );

  const handleMapClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    console.log("handleMapClick", e.target);
  }, []);

  const onDrawSelectionChange = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      // console.log("onDrawSelectionChange", e.target);

      // Check if the click target is within the SearchPopover
      // if (searchPopoverRef.current?.contains(e.target)) {
      //   return;
      // }

      // console.log(2222);

      if (!e.features?.length && drawRef.current) {
        map.removeControl(drawRef.current);
        map.off("draw.create", onDrawCreate);
        map.off("draw.update", onDrawCreate);
        // map.off("draw.selectionchange", onDrawSelectionChange);
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
        // map.on("draw.selectionchange", onDrawSelectionChange);
        map.on("click", handleMapClick);
        map.addControl(draw);
      }
    },
    [map, onDrawCreate, handleMapClick],
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
      map.on("click", handleMapClick);
      // map.on("draw.selectionchange", onDrawSelectionChange);
    }

    return () => {
      if (drawRef.current) {
        map.removeControl(drawRef.current);
        map.off("draw.create", onDrawCreate);
        map.off("draw.update", onDrawCreate);
        map.off("click", handleMapClick);
        // map.off("draw.selectionchange", onDrawSelectionChange);
        drawRef.current = null;
        setLocation(null);
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
          ref={searchPopoverRef}
          location={location}
          selectedFeature={selectedFeature}
          isPending={isFetching}
          actions={[
            {
              label: "Save to",
              onClick: () => {},
              icon: BookmarkIcon,
            },
          ]}
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
