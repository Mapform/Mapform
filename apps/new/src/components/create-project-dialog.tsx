"use client";

import { Button } from "@mapform/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useRouter } from "next/navigation";
import { useWorkspace } from "~/app/app/(authenticated)/(onboarded)/[wsSlug]/workspace-context";
import { createProjectAction } from "~/data/projects/create-project";
import { useAction } from "next-safe-action/hooks";

interface CreateProjectDropdownProps {
  tsSlug: string;
  children: React.ReactNode;
}

export function CreateProjectDropdown({
  tsSlug,
  children,
}: CreateProjectDropdownProps) {
  const router = useRouter();
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
          onClick={() => handleCreateProject("table")}
        >
          Table view
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => handleCreateProject("map")}
        >
          Map view
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
