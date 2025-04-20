import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { SplinePointerIcon } from "lucide-react";
import { useEffect } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useMapform } from "~/components/mapform";

interface LineToolProps {
  isActive: boolean;
  isSearchOpen: boolean;
  onClick: () => void;
}

export function LineTool({ isActive, isSearchOpen, onClick }: LineToolProps) {
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
        controls: {
          polygon: true,
          trash: true,
        },
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
          <SplinePointerIcon className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Line tool</TooltipContent>
    </Tooltip>
  );
}
