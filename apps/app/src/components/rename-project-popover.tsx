import { Input } from "@mapform/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";

export function RenameProjectPopoverContent() {
  return (
    <PopoverContent>
      <Input />
    </PopoverContent>
  );
}

export const RenameProjectPopover = Popover;
export const RenameProjectPopoverTrigger = PopoverTrigger;
