"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRightMenuButton,
  SidebarGroupAction,
  SidebarMenuAction,
} from "@mapform/ui/components/sidebar";
import {
  EllipsisIcon,
  ExternalLinkIcon,
  FlagIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import type { Ending } from "@mapform/db/schema";
import type { ReactElement } from "react";
import { useProject } from "../../../project-context";
import { useAction } from "next-safe-action/hooks";
import { createEndingAction } from "~/data/endings/create-ending";
import { toast } from "@mapform/ui/components/toaster";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@mapform/ui/components/dropdown-menu";
import { deleteEndingAction } from "~/data/endings/delete-ending";

const endingContent: Record<
  Ending["endingType"],
  {
    title: string;
    icon: ReactElement;
  }
> = {
  page: {
    title: "End Screen",
    icon: <FlagIcon className="size-4" />,
  },
  redirect: {
    title: "Redirect",
    icon: <ExternalLinkIcon className="size-4" />,
  },
};

export function Ending() {
  const { projectWithPages } = useProject();
  const { execute: createEnding } = useAction(createEndingAction, {
    onError: ({ error }) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.serverError,
      });
    },
  });
  const { execute: deleteEnding } = useAction(deleteEndingAction);

  const handleDelete = async () => {
    if (!projectWithPages.ending) return;

    deleteEnding({ endingId: projectWithPages.ending.id });
  };

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Ending</SidebarGroupLabel>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarGroupAction>
              <PlusIcon />
            </SidebarGroupAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[200px] overflow-hidden"
            side="left"
          >
            {Object.entries(endingContent).map(([key, value]) => (
              <DropdownMenuItem
                key={key}
                className="flex items-center gap-2"
                disabled={!!projectWithPages.ending}
                onClick={() =>
                  createEnding({
                    projectId: projectWithPages.id,
                    endingType: key as Ending["endingType"],
                  })
                }
              >
                {value.icon}
                {value.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              {projectWithPages.ending ? (
                <>
                  <SidebarRightMenuButton className="pr-8">
                    {endingContent[projectWithPages.ending.endingType].icon}
                    <span className="truncate text-sm">
                      {endingContent[projectWithPages.ending.endingType].title}
                    </span>
                  </SidebarRightMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <EllipsisIcon />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[200px] overflow-hidden"
                      side="left"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          // disabled={
                          //   isPending || currentProject.pages.length <= 1
                          // }
                          onClick={handleDelete}
                        >
                          <Trash2Icon className="size-4 flex-shrink-0" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="bg-sidebar-accent text-muted-foreground flex flex-col items-center rounded-md py-4">
                  <p className="text-center text-sm">No ending added</p>
                </div>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
