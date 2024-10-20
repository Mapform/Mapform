"use client";

import { useRootLayout } from "~/app/(authenticated)/[wsSlug]/standard-layout/context";
import { Button } from "@mapform/ui/components/button";
import { ChevronsRightIcon, PanelRightOpenIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";

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
