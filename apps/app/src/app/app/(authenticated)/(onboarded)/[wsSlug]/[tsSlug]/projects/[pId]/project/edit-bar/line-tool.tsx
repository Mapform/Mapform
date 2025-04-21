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
  CheckIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useMapform } from "~/components/mapform";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { cn } from "@mapform/lib/classnames";

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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

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
      <Popover modal onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className="hover:bg-accent hover:text-accent-foreground ml-[1px] h-full rounded-md p-0.5"
            size="icon"
            variant="ghost"
          >
            <ChevronDown size={10} strokeWidth={3} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-[200px] p-0" side="top">
          <Command>
            {/* <CommandInput
              className="h-9"
              onValueChange={setQuery}
              placeholder="Search line types..."
              value={query}
            /> */}
            <CommandList>
              <CommandEmpty>No line type found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(lineTypes).map(
                  ([key, { icon: Icon, label }]) => (
                    <CommandItem
                      key={key}
                      value={label}
                      onSelect={() => {
                        setSelectedLineType(key as keyof typeof lineTypes);
                        setQuery("");
                        setOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Icon className="size-4 flex-shrink-0" />
                      <span className="flex-1 truncate text-left">{label}</span>
                      <CheckIcon
                        className={cn(
                          "ml-auto size-4",
                          selectedLineType === key
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ),
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
