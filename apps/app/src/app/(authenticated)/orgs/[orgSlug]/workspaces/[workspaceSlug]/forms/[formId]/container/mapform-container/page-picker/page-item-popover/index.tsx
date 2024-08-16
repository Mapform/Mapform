import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Button } from "@mapform/ui/components/button";
import { DeleteIcon, EditIcon, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";

export function PageItemPopover() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          className="ml-auto hover:bg-stone-200"
          size="icon-xs"
          variant="ghost"
        >
          <Ellipsis className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => console.log(123)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log(123)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
