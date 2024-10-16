"use client";

import * as Portal from "@radix-ui/react-portal";
import { useIsClient } from "@mapform/lib/hooks/use-is-client";
import { PageList } from "./page-list";
import { Button } from "@mapform/ui/components/button";
import { ChevronsRightIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";
import { useMap } from "@mapform/mapform";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@mapform/ui/components/resizable";
import { useStandardLayout } from "../../../../standard-layout/context";
import { LayerList } from "./layer-list";

export function Drawer() {
  const { map } = useMap();
  const isClient = useIsClient();
  const { drawerRef, toggleDrawer } = useStandardLayout();

  if (!isClient) return null;

  return (
    <Portal.Root className="flex-1" container={drawerRef.current}>
      <div className="h-[50px] flex items-center gap-1 -mx-2 px-4">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  toggleDrawer();
                  const interval = setInterval(() => {
                    map?.resize();
                  }, 5);
                  setTimeout(() => {
                    clearInterval(interval);
                  }, 200);
                }}
                variant="ghost"
                size="icon-sm"
              >
                <ChevronsRightIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hide Pages</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <div className="px-4">
            <PageList />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div className="p-4">
            <LayerList />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Portal.Root>
  );
}
