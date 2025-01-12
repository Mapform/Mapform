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
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@mapform/ui/components/command";
import { ExternalLinkIcon, FlagIcon, PlusIcon } from "lucide-react";
import type { Ending } from "@mapform/db/schema";
import type { ReactElement } from "react";
import { useProject } from "../../../project-context";

const endingContent: Record<
  Ending["endingType"],
  {
    title: string;
    icon: ReactElement;
  }
> = {
  page: {
    title: "Page",
    icon: <FlagIcon />,
  },
  redirect: {
    title: "Redirect",
    icon: <ExternalLinkIcon />,
  },
};

export function Ending() {
  const { projectWithPages } = useProject();

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
            Test
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
