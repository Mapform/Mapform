"use client";

import * as Portal from "@radix-ui/react-portal";
import { useIsClient } from "@mapform/lib/hooks/use-is-client";
import { useStandardLayout } from "../../../../standard-layout/context";
import { PagePicker } from "./page-picker";
import { Button } from "@mapform/ui/components/button";
import { ChevronsRightIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";

export function Drawer() {
  const isClient = useIsClient();
  const { drawerRef, toggleDrawer } = useStandardLayout();

  if (!isClient) return null;

  return (
    <Portal.Root container={drawerRef.current}>
      <div className="h-[50px] flex items-center gap-1">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={toggleDrawer} variant="ghost" size="icon-xs">
                <ChevronsRightIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hide Pages</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <h3 className="font-semibold">Pages</h3>
      </div>
      <PagePicker />
    </Portal.Root>
  );
}
