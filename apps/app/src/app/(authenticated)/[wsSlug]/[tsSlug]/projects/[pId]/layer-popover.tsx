"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";

interface LayerPopoverProps {
  // The trigger
  children: React.ReactNode;
}

export function LayerPopover({ children }: LayerPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>Layer editor</PopoverContent>
    </Popover>
  );
}
