"use client";

import * as Portal from "@radix-ui/react-portal";
import { useIsClient } from "@mapform/lib/hooks/use-is-client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@mapform/ui/components/resizable";
import { usePage } from "../page-context";
import { LayerList } from "./layer-list";
import { PageList } from "./page-list";

export function Drawer() {
  const isClient = useIsClient();
  const { currentPage } = usePage();

  if (!isClient) return null;

  const container = document.querySelector("#sidebar-right");

  return (
    <Portal.Root className="flex-1 overflow-hidden" container={container}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <PageList />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <LayerList key={currentPage?.id} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Portal.Root>
  );
}
