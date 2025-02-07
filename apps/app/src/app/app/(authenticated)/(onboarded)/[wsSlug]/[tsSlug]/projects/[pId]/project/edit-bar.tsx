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

export function EditBar() {
  const { map } = useMapform();
  const { currentPage } = useProject();
  const { drawerValues, onDrawerValuesChange } = useMapformContent();

  const isSearchOpen = drawerValues.includes("location-search");

  if (!currentPage) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center rounded-lg border bg-white p-1 shadow-lg",
      )}
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                if (isSearchOpen) {
                  map?.setCenter([currentPage.center.x, currentPage.center.y]);
                  map?.setZoom(currentPage.zoom);
                  map?.setPitch(currentPage.pitch);
                  map?.setBearing(currentPage.bearing);

                  onDrawerValuesChange(
                    drawerValues.filter((value) => value !== "location-search"),
                  );
                } else {
                  onDrawerValuesChange([...drawerValues, "location-search"]);
                }
              }}
              size="sm"
              variant="ghost"
            >
              {isSearchOpen ? "Close Without Saving" : "Edit Map"}
            </Button>
          </TooltipTrigger>
          {!isSearchOpen ? (
            <TooltipContent>Edit map position and content</TooltipContent>
          ) : null}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
