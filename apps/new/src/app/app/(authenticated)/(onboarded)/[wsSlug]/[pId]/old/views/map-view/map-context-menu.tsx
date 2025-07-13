"use client";

import { PlusIcon, SparkleIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";

interface MapContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { x: number; y: number };
}

export function MapContextMenu({
  open,
  onOpenChange,
  position,
}: MapContextMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <div
          className="pointer-events-none absolute"
          style={{
            left: position.x,
            top: position.y,
            width: 1,
            height: 1,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        onEscapeKeyDown={() => onOpenChange(false)}
        onInteractOutside={() => onOpenChange(false)}
      >
        <DropdownMenuItem
          onClick={() => {
            onOpenChange(false);
            // Add your action here
            console.log("Ask AI");
          }}
        >
          <SparkleIcon className="size-4" />
          Ask AI
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            onOpenChange(false);
            // Add your action here
            console.log("Add new feature");
          }}
        >
          <PlusIcon className="size-4" />
          Add location
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
