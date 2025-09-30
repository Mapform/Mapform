"use client";

import { Button } from "@mapform/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { LocateIcon, MapIcon, NavigationIcon, PlusIcon } from "lucide-react";
import { useParamsContext } from "~/lib/params/client";
import { useWorkspace } from "~/app/app/(authenticated)/(onboarded)/[wsSlug]/workspace-context";
import { useGeolocation } from "@mapform/lib/hooks/use-geolocation";

export function AddContextDropdown() {
  const { workspaceDirectory } = useWorkspace();
  const { params, setQueryStates } = useParamsContext();
  const { getCurrentPosition, coords } = useGeolocation();

  const allProjects = workspaceDirectory.teamspaces.flatMap((teamspace) =>
    teamspace.projects.flatMap((project) => project),
  );

  const chatOptionsCount =
    allProjects.filter((project) =>
      params.chatOptions?.projects?.includes(project.id),
    ).length +
    (params.chatOptions?.mapCenter ? 1 : 0) +
    (params.chatOptions?.userCenter ? 1 : 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="text-muted-foreground !p-0"
          style={{
            background: "none",
          }}
          variant="ghost"
        >
          <PlusIcon className="size-4" />
          Add Context
          {chatOptionsCount > 0 && (
            <div className="bg-muted ml-1 inline flex-grow-0 self-center rounded-md px-2 py-1 font-mono text-xs">
              {chatOptionsCount}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MapIcon className="size-4" />
            Maps
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {workspaceDirectory.teamspaces
              .flatMap((teamspace) =>
                teamspace.projects.flatMap((project) => project),
              )
              .map((project) => (
                <DropdownMenuCheckboxItem
                  key={project.id}
                  checked={params.chatOptions?.projects?.includes(project.id)}
                  onCheckedChange={(checked) => {
                    void setQueryStates({
                      chatOptions: {
                        ...params.chatOptions,
                        projects: checked
                          ? [
                              ...(params.chatOptions?.projects ?? []),
                              project.id,
                            ]
                          : params.chatOptions?.projects?.filter(
                              (p) => p !== project.id,
                            ),
                      },
                    });
                  }}
                >
                  {project.icon ? (
                    <span>{project.icon}</span>
                  ) : (
                    <MapIcon className="size-4" />
                  )}
                  {project.name || "New Map"}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuCheckboxItem
          checked={params.chatOptions?.mapCenter}
          onCheckedChange={(checked) => {
            void setQueryStates({
              chatOptions: {
                ...params.chatOptions,
                mapCenter: checked,
              },
            });
          }}
        >
          <LocateIcon className="size-4" />
          Map center
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={params.chatOptions?.userCenter}
          onCheckedChange={async (checked) => {
            if (checked && !coords) {
              await getCurrentPosition();
            }

            void setQueryStates({
              chatOptions: {
                ...params.chatOptions,
                userCenter: checked,
              },
            });
          }}
        >
          <NavigationIcon className="size-4" />
          Your location
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
