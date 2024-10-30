import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";

export const CellPopover = Popover;

export const CellPopoverTrigger = PopoverTrigger;

export const CellAnchor = PopoverAnchor;

export function CellPopoverContent() {
  return <PopoverContent align="start">Test</PopoverContent>;
}
