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
} from "@mapform/ui/components/sidebar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import { ExternalLinkIcon, FlagIcon, PlusIcon } from "lucide-react";
import type { Ending } from "@mapform/db/schema";
import type { ReactElement } from "react";
import { useProject } from "../../../project-context";
import { useAction } from "next-safe-action/hooks";
import { createEndingAction } from "~/data/endings/create-ending";
import { toast } from "@mapform/ui/components/toaster";

const endingContent: Record<
  Ending["endingType"],
  {
    title: string;
    icon: ReactElement;
  }
> = {
  page: {
    title: "End Screen",
    icon: <FlagIcon />,
  },
  redirect: {
    title: "Redirect",
    icon: <ExternalLinkIcon />,
  },
};

export function Ending() {
  const { projectWithPages } = useProject();
  const { execute } = useAction(createEndingAction, {
    onError: ({ error }) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.serverError,
      });
    },
  });

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Ending</SidebarGroupLabel>
        <Popover>
          <PopoverTrigger asChild>
            <SidebarGroupAction>
              <PlusIcon />
            </SidebarGroupAction>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[200px] p-0" side="right">
            <Command>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    className="flex items-center"
                    onSelect={() =>
                      execute({
                        projectId: projectWithPages.id,
                        endingType: "page",
                      })
                    }
                  >
                    <FlagIcon className="mr-2 size-4 flex-shrink-0" />
                    End Screen
                  </CommandItem>
                  <CommandItem
                    className="flex items-center"
                    onSelect={() =>
                      execute({
                        projectId: projectWithPages.id,
                        endingType: "redirect",
                      })
                    }
                  >
                    <ExternalLinkIcon className="mr-2 size-4 flex-shrink-0" />
                    Redirect
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              {projectWithPages.ending ? (
                <SidebarRightMenuButton className="pr-8">
                  {endingContent[projectWithPages.ending.endingType].icon}
                  <span className="truncate text-sm">
                    {endingContent[projectWithPages.ending.endingType].title}
                  </span>
                </SidebarRightMenuButton>
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
