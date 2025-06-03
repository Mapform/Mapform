import { Button } from "@mapform/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { EllipsisIcon, FocusIcon, ScanIcon } from "lucide-react";
import { useMapform } from "~/components/mapform";
import { useProject } from "../../project-context";

export function MapOptions() {
  const { map } = useMapform();
  const { updatePageServerAction } = useProject();
  const currentPage = updatePageServerAction.optimisticState;

  if (!currentPage) {
    return null;
  }

  const handleSaveMapPosition = () => {
    const center = map?.getCenter();
    const zoom = map?.getZoom();
    const pitch = map?.getPitch();
    const bearing = map?.getBearing();

    if (
      center !== undefined &&
      zoom !== undefined &&
      pitch !== undefined &&
      bearing !== undefined
    ) {
      const payload = {
        id: currentPage.id,
        center: {
          x: center.lng,
          y: center.lat,
        },
        zoom,
        pitch,
        bearing,
      };

      updatePageServerAction.execute({
        ...currentPage,
        ...payload,
      });
    }
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <EllipsisIcon className="size-5" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Map options</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="top">
        <DropdownMenuItem
          disabled={updatePageServerAction.isPending}
          onClick={handleSaveMapPosition}
        >
          <ScanIcon className="mr-2 size-4" />
          Set default view
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            map?.setCenter([currentPage.center.x, currentPage.center.y]);
            map?.setZoom(currentPage.zoom);
            map?.setPitch(currentPage.pitch);
            map?.setBearing(currentPage.bearing);
          }}
        >
          <FocusIcon className="mr-2 size-4" />
          Re-center view
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
