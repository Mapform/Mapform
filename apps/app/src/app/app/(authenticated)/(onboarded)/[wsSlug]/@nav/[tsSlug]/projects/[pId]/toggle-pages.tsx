"use client";

import { Button } from "@mapform/ui/components/button";
import { PanelRightOpenIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useSidebarRight } from "@mapform/ui/components/sidebar";

export default function TogglePages() {
  const { open, setOpen } = useSidebarRight();

  if (open) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              setOpen(true);
            }}
            size="icon-sm"
            variant="ghost"
          >
            <PanelRightOpenIcon className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Show Pages</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
