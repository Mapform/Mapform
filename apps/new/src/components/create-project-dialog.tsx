"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useWorkspace } from "~/app/app/(authenticated)/(onboarded)/[wsSlug]/workspace-context";
import { createProjectAction } from "~/data/projects/create-project";
import { useAction } from "next-safe-action/hooks";
import { VIEWS } from "~/constants/views";

interface CreateProjectDropdownProps {
  tsSlug: string;
  children: React.ReactNode;
}

export function CreateProjectDropdown({
  tsSlug,
  children,
}: CreateProjectDropdownProps) {
  const { workspaceDirectory } = useWorkspace();
  const teamspace = workspaceDirectory.teamspaces.find(
    (ts) => ts.slug === tsSlug,
  );
  const { execute, isPending } = useAction(createProjectAction);

  const handleCreateProject = (viewType: "table" | "map") => {
    if (!teamspace) {
      throw new Error("Teamspace not found");
    }

    execute({
      teamspaceId: teamspace.id,
      viewType,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => handleCreateProject("map")}
        >
          <VIEWS.map.icon className="size-4" />
          <span>{VIEWS.map.name} View</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => handleCreateProject("table")}
        >
          <VIEWS.table.icon className="size-4" />
          <span>{VIEWS.table.name} View</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
