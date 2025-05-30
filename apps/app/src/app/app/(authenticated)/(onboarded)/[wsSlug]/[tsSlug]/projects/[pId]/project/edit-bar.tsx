import { Button } from "@mapform/ui/components/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useMapform, useMapformContent } from "~/components/mapform";
import { cn } from "@mapform/lib/classnames";
import { useProject } from "../project-context";
import { FocusIcon, HandIcon, SearchIcon } from "lucide-react";

interface EditBarProps {
  onSearchOpenChange: (isOpen: boolean) => void;
}

export function EditBar({ onSearchOpenChange }: EditBarProps) {
  const { map } = useMapform();
  const { updatePageServerAction } = useProject();
  const { drawerValues } = useMapformContent();

  const isSearchOpen = drawerValues.includes("location-search");
  const isMarkerEditOpen = drawerValues.includes("marker-edit");

  const currentPage = updatePageServerAction.optimisticState;

  if (!currentPage) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center divide-x rounded-xl border bg-white p-1.5 shadow-lg",
        )}
      >
        <div className="flex gap-1 pr-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  onSearchOpenChange(false);
                }}
                size="icon"
                variant={isSearchOpen || isMarkerEditOpen ? "ghost" : "default"}
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
                    onSearchOpenChange(true);
                  }
                }}
                size="icon"
                variant={isSearchOpen ? "default" : "ghost"}
              >
                <SearchIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search tool</TooltipContent>
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
              <p>Re-center map</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
