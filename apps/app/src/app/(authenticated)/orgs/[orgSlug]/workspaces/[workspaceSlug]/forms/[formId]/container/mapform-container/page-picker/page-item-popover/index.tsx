import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Button } from "@mapform/ui/components/button";
import { DeleteIcon, EditIcon, Ellipsis } from "lucide-react";

export function PageItemPopover() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="ml-auto hover:bg-stone-200"
          size="icon-xs"
          variant="ghost"
        >
          <Ellipsis className="h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 overflow-hidden w-[200px]">
        <div className="px-3 py-2 border-b">
          <div className="w-full flex flex-col gap-1">
            <button
              className="appearance-none flex gap-2 items-center text-left hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
              onClick={() => console.log(123)}
              type="button"
            >
              <div className="h-4 w-4 flex items-center justify-center">
                <EditIcon className="h-4 w-4 flex-shrink-0" />
              </div>
              Edit
            </button>
            <button
              className="appearance-none flex gap-2 items-center text-left hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
              onClick={() => console.log(123)}
              type="button"
            >
              <div className="h-4 w-4 flex items-center justify-center">
                <DeleteIcon className="h-4 w-4 flex-shrink-0" />
              </div>
              Delete
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
