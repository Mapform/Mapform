"use client";

import { useStandardLayout } from "~/app/(authenticated)/[wsSlug]/standard-layout/context";
import { Button } from "@mapform/ui/components/button";
import { ListIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";

export default function TogglePages() {
  const { showDrawer, setShowDrawer } = useStandardLayout();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setShowDrawer(!showDrawer)}
            size="icon-sm"
            variant="ghost"
          >
            <ListIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {showDrawer ? "Hide Pages" : "Show Pages"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
