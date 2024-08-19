import { Button } from "@mapform/ui/components/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import type { Layer } from "@mapform/db";
import type { Dispatch, SetStateAction } from "react";
import { deleteLayer } from "~/data/layers/delete-layer";

interface LayerSubmenuProps {
  layerId: string;
  setDragLayers: Dispatch<SetStateAction<Layer[]>>;
}

export function LayerSubmenu({ layerId, setDragLayers }: LayerSubmenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="ml-auto hover:bg-stone-200 data-[state=open]:bg-stone-200"
          size="icon-xs"
          variant="ghost"
        >
          <Ellipsis className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuItem
          onClick={() => {
            // Needed to fix issue where menu can't be clicked again afterwards
            document.body.style.pointerEvents = "";
          }}
        >
          Edit
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={async () => {
            await deleteLayer({
              layerId,
            });

            setDragLayers((layers) => layers.filter((l) => l.id !== layerId));
            // Needed to fix issue where menu can't be clicked again afterwards
            document.body.style.pointerEvents = "";
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
