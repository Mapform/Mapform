import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import type { LucideIcon } from "lucide-react";
import {
  BikeIcon,
  CarIcon,
  ChevronDown,
  FootprintsIcon,
  SplineIcon,
} from "lucide-react";
import { useEffect } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useMapform } from "~/components/mapform";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";

interface LineToolProps {
  isActive: boolean;
  isSearchOpen: boolean;
  selectedLineType: keyof typeof lineTypes;
  setSelectedLineType: (lineType: keyof typeof lineTypes) => void;
  onClick: () => void;
}

export const lineTypes: Record<string, { icon: LucideIcon; label: string }> = {
  line: {
    icon: SplineIcon,
    label: "Line",
  },
  walking: {
    icon: FootprintsIcon,
    label: "Walking route",
  },
  cycling: {
    icon: BikeIcon,
    label: "Cycling route",
  },
  driving: {
    icon: CarIcon,
    label: "Driving route",
  },
};

export function LineTool({
  isActive,
  isSearchOpen,
  selectedLineType,
  setSelectedLineType,
  onClick,
}: LineToolProps) {
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
        // controls: {
        //   polygon: true,
        //   trash: true,
        // },
        defaultMode: "draw_line_string",
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
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size="icon"
            variant={isActive && !isSearchOpen ? "default" : "ghost"}
          >
            {(() => {
              const LineTypeIcon = lineTypes[selectedLineType]?.icon;
              return LineTypeIcon ? <LineTypeIcon className="size-5" /> : null;
            })()}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Line tool</TooltipContent>
      </Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground ml-[1px] h-full rounded-md p-0.5">
          <ChevronDown size={10} strokeWidth={3} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center">
          <DropdownMenuCheckboxItem
            checked={selectedLineType === "line"}
            onCheckedChange={() => setSelectedLineType("line")}
          >
            <SplineIcon className="mr-2 size-4" />
            Line
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedLineType === "walking"}
            onCheckedChange={() => setSelectedLineType("walking")}
          >
            <FootprintsIcon className="mr-2 size-4" />
            Walking route
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedLineType === "cycling"}
            onCheckedChange={() => setSelectedLineType("cycling")}
          >
            <BikeIcon className="mr-2 size-4" />
            Cycling route
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedLineType === "driving"}
            onCheckedChange={() => setSelectedLineType("driving")}
          >
            <CarIcon className="mr-2 size-4" />
            Driving route
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
