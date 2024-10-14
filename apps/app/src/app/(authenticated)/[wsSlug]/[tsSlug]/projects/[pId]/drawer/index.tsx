"use client";

import * as Portal from "@radix-ui/react-portal";
import { useIsClient } from "@mapform/lib/hooks/use-is-client";
import { useStandardLayout } from "../../../../standard-layout/context";
import { PagePicker } from "./page-picker";
import { createPage } from "~/data/pages/create-page";
import { Button } from "@mapform/ui/components/button";
import { ChevronsRightIcon, PlusIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";
import { useAction } from "next-safe-action/hooks";
import { usePage } from "../page-context";
import { useMap } from "@mapform/mapform";
import { useProject } from "../project-context";

export function Drawer() {
  const { map } = useMap();
  const isClient = useIsClient();
  const { setActivePage, openMapEditor, setOpenMapEditor } = usePage();
  const { optimisticProjectWithPages, updateProjectWithPages } = useProject();
  const { drawerRef, toggleDrawer } = useStandardLayout();
  const { execute: executeCreatePage, status: createPageStatus } = useAction(
    createPage,
    {
      onSuccess: (newPage) => {
        const newPageData = newPage.data;

        if (!newPageData) return;

        setActivePage(newPageData);
      },
    }
  );

  if (!isClient) return null;

  if (openMapEditor) {
    return (
      <Portal.Root container={drawerRef.current}>
        <div className="h-[50px] flex items-center gap-1 -mr-2">
          <h3 className="font-semibold mr-auto">Layers</h3>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => {}} variant="ghost" size="icon-sm">
                  <PlusIcon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Layer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Portal.Root>
    );
  }

  return (
    <Portal.Root container={drawerRef.current}>
      <div className="h-[50px] flex items-center gap-1 -mx-2">
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

          <h3 className="font-semibold mr-auto">Pages</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  const loc = map?.getCenter();
                  const zoom = map?.getZoom();
                  const pitch = map?.getPitch();
                  const bearing = map?.getBearing();

                  if (
                    !loc ||
                    zoom === undefined ||
                    pitch === undefined ||
                    bearing === undefined
                  )
                    return;

                  executeCreatePage({
                    projectId: optimisticProjectWithPages.id,
                    center: { x: loc.lng, y: loc.lat },
                    zoom,
                    pitch,
                    bearing,
                  });
                }}
                variant="ghost"
                size="icon-sm"
              >
                <PlusIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Page</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <PagePicker />
    </Portal.Root>
  );
}
