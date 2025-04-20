import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { PentagonIcon } from "lucide-react";
import { useEffect } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useMapform } from "~/components/mapform";

interface ShapeToolProps {
  isActive: boolean;
  isSearchOpen: boolean;
  onClick: () => void;
}

export function ShapeTool({ isActive, isSearchOpen, onClick }: ShapeToolProps) {
  const { map } = useMapform();

  const onDrawCreate = (
    e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
  ) => {
    console.log(1111, e);
  };

  useEffect(() => {
    let draw: MapboxDraw | undefined;

    if (isActive) {
      draw = new MapboxDraw({
        displayControlsDefault: false,

        defaultMode: "draw_polygon",
      });
      map?.addControl(draw);
      map?.on("draw.create", onDrawCreate);
    }

    return () => {
      if (draw) {
        map?.removeControl(draw);
        map?.off("draw.create", onDrawCreate);
      }
    };
  }, [isActive, map]);

  return (
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
  );
}
