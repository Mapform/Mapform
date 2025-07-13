"use client";

import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { Button } from "@mapform/ui/components/button";
import { PlusIcon, SmilePlusIcon } from "lucide-react";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { useProject } from "../context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@mapform/ui/components/dropdown-menu";
import { VIEWS } from "~/constants/views";
import { ViewButton } from "./view-button";
import { useAction } from "next-safe-action/hooks";
import { createViewAction } from "~/data/views/create-view";
import { MapDrawer } from "~/components/map-drawer";

export function Views() {
  const { projectService, activeView } = useProject();

  const { execute, isPending } = useAction(createViewAction);

  return (
    <MapDrawer
      initialOpen
      open
      // TODO: Need to calculate remaining width of the screen and pass in
      width={activeView?.type === "table" ? 800 : undefined}
    >
      <header>
        <div>
          <Tooltip>
            <EmojiPopover
              onIconChange={(emoji) => {
                projectService.execute({
                  id: projectService.optimisticState.id,
                  icon: emoji,
                });
              }}
            >
              <TooltipTrigger asChild>
                {projectService.optimisticState.icon ? (
                  <button
                    className="hover:bg-muted rounded-lg text-6xl"
                    type="button"
                  >
                    {projectService.optimisticState.icon}
                  </button>
                ) : (
                  <Button size="icon-sm" type="button" variant="ghost">
                    <SmilePlusIcon className="size-4" />
                  </Button>
                )}
              </TooltipTrigger>
            </EmojiPopover>
            <TooltipContent>Add emoji</TooltipContent>
          </Tooltip>
        </div>
        <AutoSizeTextArea
          className="text-4xl font-bold"
          placeholder="Untitled"
          value={projectService.optimisticState.name ?? ""}
          onChange={(value) => {
            projectService.execute({
              id: projectService.optimisticState.id,
              name: value,
            });
          }}
        />
        <AutoSizeTextArea
          placeholder="Description"
          value={projectService.optimisticState.description ?? ""}
          onChange={(value) => {
            projectService.execute({
              id: projectService.optimisticState.id,
              description: value,
            });
          }}
        />
        <div className="mt-2 flex gap-1">
          {projectService.optimisticState.views.map((view) => (
            <ViewButton key={view.id} view={view} />
          ))}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-sm" variant="ghost">
                    <PlusIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Add View</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => {
                  execute({
                    projectId: projectService.optimisticState.id,
                    viewType: "map",
                  });
                }}
              >
                <VIEWS.map.icon className="size-4" />
                <span>{VIEWS.map.name} View</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  execute({
                    projectId: projectService.optimisticState.id,
                    viewType: "table",
                  });
                }}
              >
                <VIEWS.table.icon className="size-4" />
                <span>{VIEWS.table.name} View</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </MapDrawer>
  );
}
