"use client";

import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { useProject } from "../context";
import { VIEWS } from "~/constants/views";
import { Button } from "@mapform/ui/components/button";
import { Table } from "./table";
import { PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { createViewAction } from "~/data/views/create-view";

export function TableView() {
  const { project, activeView } = useProject();

  const { execute, isPending } = useAction(createViewAction);

  return (
    <div className="px-8">
      <AutoSizeTextArea
        className="text-4xl font-bold"
        placeholder="Untitled"
        value={project.name ?? ""}
        onChange={(value) => {
          console.log(value);
        }}
      />
      <AutoSizeTextArea
        placeholder="Description"
        value={project.description ?? ""}
        onChange={(value) => {
          console.log(value);
        }}
      />
      <div className="flex gap-1">
        {project.views.map((view) => {
          const viewType = view.type;
          const ViewIcon = VIEWS[viewType].icon;
          const isActive = activeView?.id === view.id;

          return (
            <Button
              key={view.id}
              size="sm"
              variant={isActive ? "secondary" : "outline"}
            >
              <ViewIcon className="mr-2 size-4" />
              <span>{view.name ?? VIEWS[viewType].name}</span>
            </Button>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="ghost">
              <PlusIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => {
                execute({ projectId: project.id, viewType: "map" });
              }}
            >
              <VIEWS.map.icon className="mr-2 size-4" />
              <span>{VIEWS.map.name} View</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                execute({ projectId: project.id, viewType: "table" });
              }}
            >
              <VIEWS.table.icon className="mr-2 size-4" />
              <span>{VIEWS.table.name} View</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table />
    </div>
  );
}
