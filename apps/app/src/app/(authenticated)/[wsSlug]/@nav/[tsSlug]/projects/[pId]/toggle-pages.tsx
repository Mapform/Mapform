"use client";

import { Button } from "@mapform/ui/components/button";
import { PanelRightOpenIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useRootLayout } from "~/app/(authenticated)/[wsSlug]/root-layout/context";

export default function TogglePages() {
  const { showDrawer, toggleDrawer } = useRootLayout();

  if (showDrawer) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={toggleDrawer} size="icon-sm" variant="ghost">
            <PanelRightOpenIcon className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Show Pages</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
