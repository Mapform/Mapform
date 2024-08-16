import { Button } from "@mapform/ui/components/button";
import { Ellipsis } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { deleteStep } from "~/data/steps/delete";

export function PageItemSubmenu({ pageId }: { pageId: string }) {
  const { execute: executeDeleteStep } = useAction(deleteStep);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="ml-auto hover:bg-stone-200 data-[state=open]:bg-accent"
          size="icon-xs"
          variant="ghost"
        >
          <Ellipsis className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            // Needed to fix issue where menu can't be clicked again afterwards
            document.body.style.pointerEvents = "";
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            executeDeleteStep({
              stepId: pageId,
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
