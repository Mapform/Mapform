"use client";

import { PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useParams } from "next/navigation";

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
  const params = useParams();

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
        className="w-48"
        onEscapeKeyDown={() => onOpenChange(false)}
        onInteractOutside={() => onOpenChange(false)}
      >
        {/* <DropdownMenuItem
          onClick={() => {
            onOpenChange(false);
            // Add your action here
            console.log("Add new feature");
          }}
        >
          <ScanIcon className="size-4" />
          Set default view
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
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
