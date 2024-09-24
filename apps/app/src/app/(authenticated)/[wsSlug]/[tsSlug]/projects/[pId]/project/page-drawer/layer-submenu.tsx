import { Button } from "@mapform/ui/components/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { deleteLayer } from "~/data/layers/delete-layer";
import { usePage } from "../../page-context";

interface LayerSubmenuProps {
  layerId: string;
}

export function LayerSubmenu({ layerId }: LayerSubmenuProps) {
  const { optimisticPage, updatePage } = usePage();
  const { execute } = useAction(deleteLayer);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="ml-auto hover:bg-stone-200 data-[state=open]:bg-stone-200 -mr-1"
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
          onClick={() => {
            if (!optimisticPage) return;

            updatePage({
              ...optimisticPage,
              layersToPages: optimisticPage.layersToPages.filter(
                (ltp) => ltp.layerId !== layerId
              ),
            });

            execute({
              layerId,
            });

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
