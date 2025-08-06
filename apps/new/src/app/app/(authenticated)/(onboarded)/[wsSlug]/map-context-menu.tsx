"use client";

import { PlusIcon, SparkleIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useParams } from "next/navigation";
import { useParamsContext } from "~/lib/params/client";

interface MapContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { x: number; y: number; longitude: number; latitude: number };
}

export function MapContextMenu({
  open,
  onOpenChange,
  position,
}: MapContextMenuProps) {
  const params = useParams();
  const { setQueryStates } = useParamsContext();

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
        <DropdownMenuItem
          onClick={async () => {
            onOpenChange(false);
            await setQueryStates(
              {
                query: null,
                chatId: null,
              },
              { shallow: false },
            );
            await setQueryStates(
              {
                query: `What can you tell me about this location: ${position.longitude}, ${position.latitude}`,
                chatId: crypto.randomUUID(),
              },
              { shallow: true },
            );
          }}
        >
          <SparkleIcon className="size-4" />
          Ask AI
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>
          <PlusIcon className="size-4" />
          Add location
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
