"use client";

import { Button } from "@mapform/ui/components/button";
import { PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useSidebarRight } from "@mapform/ui/components/sidebar";

export default function TogglePages() {
  const { open, setOpen } = useSidebarRight();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              setOpen(!open);
            }}
            size="icon-sm"
            variant="ghost"
          >
            {open ? (
              <PanelRightCloseIcon className="size-5" />
            ) : (
              <PanelRightOpenIcon className="size-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{open ? "Hide" : "Show"} Pages</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
