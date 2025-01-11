"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRightMenuButton,
} from "@mapform/ui/components/sidebar";
import { ExternalLinkIcon, FlagIcon } from "lucide-react";
import type { Ending } from "@mapform/db/schema";
import type { ReactElement } from "react";
import { useProject } from "../../project-context";

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
        <SidebarGroupContent>
          <SidebarMenu>
            {projectWithPages.ending ? (
              <SidebarMenuItem>
                <SidebarRightMenuButton className="pr-8">
                  {endingContent[projectWithPages.ending.endingType].icon}
                  <span className="truncate text-sm">
                    {endingContent[projectWithPages.ending.endingType].title}
                  </span>
                </SidebarRightMenuButton>
              </SidebarMenuItem>
            ) : null}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
