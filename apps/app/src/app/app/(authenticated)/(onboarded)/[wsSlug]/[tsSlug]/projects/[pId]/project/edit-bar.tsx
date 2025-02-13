import { Button } from "@mapform/ui/components/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useMapform, useMapformContent } from "~/components/new-mapform";
import { cn } from "@mapform/lib/classnames";
import { useProject } from "../project-context";
import { FocusIcon, HandIcon, MapPinPlusIcon, SearchIcon } from "lucide-react";

export function EditBar() {
  const { map } = useMapform();
  const { currentPage } = useProject();
  const { drawerValues, onDrawerValuesChange } = useMapformContent();

  const isSearchOpen = drawerValues.includes("location-search");

  if (!currentPage) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center divide-x rounded-lg border bg-white p-1.5 shadow-lg",
        )}
      >
        <div className="flex gap-1 pr-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  onDrawerValuesChange(
                    drawerValues.filter((value) => value !== "location-search"),
                  );
                }}
                size="icon"
                variant={isSearchOpen ? "ghost" : "default"}
              >
                <HandIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hand tool</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  if (!isSearchOpen) {
                    onDrawerValuesChange([...drawerValues, "location-search"]);
                  }
                }}
                size="icon"
                variant={isSearchOpen ? "default" : "ghost"}
              >
                <SearchIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search and change map position</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <MapPinPlusIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add markers</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-1 pl-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  map?.setCenter([currentPage.center.x, currentPage.center.y]);
                  map?.setZoom(currentPage.zoom);
                  map?.setPitch(currentPage.pitch);
                  map?.setBearing(currentPage.bearing);
                }}
                size="icon"
                variant="ghost"
              >
                <FocusIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Recenter map</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
