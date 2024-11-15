"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@mapform/ui/components/dropdown-menu";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarLeft,
  SidebarMenu,
  SidebarLeftMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@mapform/ui/components/sidebar";
import {
  AudioWaveform,
  ChevronsUpDown,
  Command,
  GalleryVerticalEnd,
  HomeIcon,
  Plus,
  MapIcon,
  Settings2,
  TableIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@mapform/ui/components/collapsible";
import { useWorkspace } from "../workspace-context";

export function WorkspaceSidebar() {
  const { workspaceDirectory, workspaceSlug } = useWorkspace();

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Home",
        url: `/app/${workspaceSlug}`,
        icon: HomeIcon,
        isActive: true,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    spaces: workspaceDirectory.teamspaces.map((teamspace) => ({
      title: teamspace.name,
      url: `/app/${workspaceSlug}/${teamspace.slug}`,
      projects: teamspace.projects.map((project) => ({
        title: project.name,
        url: `/app/${workspaceSlug}/${teamspace.slug}/projects/${project.id}`,
      })),
      datasets: teamspace.datasets.map((dataset) => ({
        title: dataset.name,
        url: `/app/${workspaceSlug}/${teamspace.slug}/datasets/${dataset.id}`,
      })),
    })),
  };

  return (
    <SidebarLeft>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarLeftMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  size="lg"
                >
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    {/* <activeTeam.logo className="size-4" /> */}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {/* {activeTeam.name} */}
                      Team name
                    </span>
                    <span className="truncate text-xs">Pro</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarLeftMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Teams
                </DropdownMenuLabel>
                {data.teams.map((team, index) => (
                  <DropdownMenuItem
                    className="gap-2 p-2"
                    key={team.name}
                    // onClick={() => setActiveTeam(team)}
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <team.logo className="size-4 shrink-0" />
                    </div>
                    {/* {team.name} */}
                    Team
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                    <Plus className="size-4" />
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Add team
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarLeftMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarLeftMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {data.spaces.map((space) => (
          <SidebarGroup key={space.title}>
            <SidebarGroupLabel>{space.title}</SidebarGroupLabel>
            <SidebarMenu>
              <Collapsible className="group/collapsible" defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarLeftMenuButton asChild>
                      <a href={space.url}>
                        <MapIcon />
                        <span>Projects</span>
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </a>
                    </SidebarLeftMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {space.projects.map((project) => (
                      <SidebarMenuSub key={project.title}>
                        <SidebarMenuSubItem>
                          <SidebarLeftMenuButton asChild>
                            <a href={project.url}>
                              {/* <project.icon /> */}
                              <span>{project.title}</span>
                            </a>
                          </SidebarLeftMenuButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    ))}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarLeftMenuButton asChild>
                      <a href={space.url}>
                        <TableIcon />
                        <span>Datasets</span>
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </a>
                    </SidebarLeftMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {space.datasets.map((dataset) => (
                      <SidebarMenuSub key={dataset.title}>
                        <SidebarMenuSubItem>
                          <SidebarLeftMenuButton asChild>
                            <a href={dataset.url}>
                              {/* <project.icon /> */}
                              <span>{dataset.title}</span>
                            </a>
                          </SidebarLeftMenuButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    ))}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </SidebarLeft>
  );
}
