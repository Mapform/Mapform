import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { MapPinPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useMapform } from "~/components/mapform";
import { LayerSavePopover } from "../layer-save-popover";

interface PointToolProps {
  isActive: boolean;
  isSearchOpen: boolean;
  onClick: () => void;
}

export function PointTool({ isActive, isSearchOpen, onClick }: PointToolProps) {
  const { map } = useMapform();
  const [layerId, setLayerId] = useState<string | null>(null);

  useEffect(() => {
    let draw: MapboxDraw | undefined;

    if (isActive && layerId) {
      draw = new MapboxDraw({
        displayControlsDefault: false,
        defaultMode: "draw_point",
      });
      map?.addControl(draw);
    }

    return () => {
      if (draw) {
        map?.removeControl(draw);
      }
    };
  }, [isActive, map, layerId]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <LayerSavePopover
          onSelect={setLayerId}
          side="top"
          align="center"
          open={!layerId && isActive}
        >
          <Button
            onClick={onClick}
            size="icon"
            variant={isActive && !isSearchOpen ? "default" : "ghost"}
          >
            <MapPinPlusIcon className="size-5" />
          </Button>
        </LayerSavePopover>
      </TooltipTrigger>
      <TooltipContent>Point tool</TooltipContent>
    </Tooltip>
  );
}
