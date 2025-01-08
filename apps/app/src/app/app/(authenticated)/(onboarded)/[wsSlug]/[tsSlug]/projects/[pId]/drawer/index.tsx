"use client";

import * as Portal from "@radix-ui/react-portal";
import { useIsClient } from "@mapform/lib/hooks/use-is-client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@mapform/ui/components/resizable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@mapform/ui/components/tabs";
import { useProject } from "../project-context";
import { LayerList } from "./layer-list";
import { PageList } from "./page-list";
import { Ending } from "./ending";

export function Drawer() {
  const isClient = useIsClient();
  const { currentPage } = useProject();

  if (!isClient) return null;

  const container = document.querySelector("#sidebar-right");

  return (
    <Portal.Root className="flex-1 overflow-hidden" container={container}>
      <Tabs defaultValue="settings" className="flex h-full w-full flex-col">
        <div className="flex h-16 items-center p-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Content</TabsTrigger>
            <TabsTrigger value="password">Settings</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent className="mt-0 flex-1" value="settings">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel minSize={15}>
              <PageList />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel minSize={10} maxSize={10}>
              <Ending />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel minSize={15}>
              <LayerList key={currentPage?.id} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </Portal.Root>
  );
}
