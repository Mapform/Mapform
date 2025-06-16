"use client";

import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { useProject } from "../context";
import { VIEWS } from "~/constants/views";
import { Button } from "@mapform/ui/components/button";
import { Table } from "./table";

export function TableView() {
  const { project, activeView } = useProject();

  console.log(project);

  return (
    <div>
      <AutoSizeTextArea
        className="text-4xl font-bold"
        placeholder="Untitled"
        value={project?.name ?? ""}
        onChange={(value) => {
          console.log(value);
        }}
      />
      <AutoSizeTextArea
        placeholder="Description"
        value={project?.description ?? ""}
        onChange={(value) => {
          console.log(value);
        }}
      />
      <div>
        {project?.views.map((view) => {
          const viewType = view.type;
          const ViewIcon = VIEWS[viewType].icon;
          const isActive = activeView?.id === view.id;

          return (
            <Button
              key={view.id}
              size="sm"
              variant={isActive ? "default" : "outline"}
            >
              <ViewIcon className="mr-2 size-4" />
              <span>{view.name ?? VIEWS[viewType].name}</span>
            </Button>
          );
        })}
      </div>
      <Table />
    </div>
  );
}
