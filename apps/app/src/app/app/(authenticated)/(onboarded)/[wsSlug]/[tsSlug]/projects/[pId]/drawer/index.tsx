"use client";

import * as Portal from "@radix-ui/react-portal";
import { useIsClient } from "@mapform/lib/hooks/use-is-client";
import { Button } from "@mapform/ui/components/button";
import { ChevronsRightIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@mapform/ui/components/resizable";
import { SidebarRight, useSidebarRight } from "@mapform/ui/components/sidebar";
import { LayerList } from "./layer-list";
import { PageList } from "./page-list";

export function Drawer() {
  const isClient = useIsClient();
  const { open, setOpen } = useSidebarRight();

  if (!isClient) return null;

  return <SidebarRight>Test</SidebarRight>;

  return (
    <Portal.Root className="flex-1">
      <div className="-mx-2 flex h-[50px] items-center gap-1 px-4">
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
