"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  SidebarMenuAction,
} from "@mapform/ui/components/sidebar";
import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  HomeIcon,
  Plus,
  MapIcon,
  Settings2Icon,
  TableIcon,
  ChevronRightIcon,
  LogOutIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@mapform/ui/components/collapsible";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@mapform/ui/components/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "~/data/auth/sign-out";
import { useAuth } from "../../auth-context";
import { useWorkspace } from "./workspace-context";

export function LeftSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const {
    workspaceMemberships,
    workspaceDirectory,
    workspaceSlug,
    currentWorkspace,
  } = useWorkspace();

  if (!user) {
    return null;
  }

  const data = {
    user: {
      name: user.name ?? "No Name",
      email: user.email,
      avatar: "/avatars/shadcn.jpg", // TODO
    },
    workspaces: workspaceMemberships.map((membership) => ({
      name: membership.workspace.name,
      logo: GalleryVerticalEnd,
      url: `/app/${membership.workspace.slug}`,
      isActive: membership.workspace.slug === workspaceSlug,
      plan: "Basic",
    })),
    navMain: [
      {
        title: "Home",
        url: `/app/${workspaceSlug}`,
        icon: HomeIcon,
        isActive: pathname === `/app/${workspaceSlug}`,
      },
      {
        title: "Settings",
        url: `/app/${workspaceSlug}/settings`,
        icon: Settings2Icon,
        isActive: pathname === `/app/${workspaceSlug}/settings`,
      },
    ],
    spaces: workspaceDirectory.teamspaces.map((teamspace) => ({
      title: teamspace.name,
      project: {
        url: `/app/${workspaceSlug}/${teamspace.slug}`,
        isActive: pathname === `/app/${workspaceSlug}/${teamspace.slug}`,
        projects: teamspace.projects.map((project) => ({
          title: project.name,
          url: `/app/${workspaceSlug}/${teamspace.slug}/projects/${project.id}`,
          isActive:
            pathname ===
            `/app/${workspaceSlug}/${teamspace.slug}/projects/${project.id}`,
        })),
      },
      dataset: {
        url: `/app/${workspaceSlug}/${teamspace.slug}/datasets`,
        isActive:
          pathname === `/app/${workspaceSlug}/${teamspace.slug}/datasets`,
        datasets: teamspace.datasets.map((dataset) => ({
          title: dataset.name,
          url: `/app/${workspaceSlug}/${teamspace.slug}/datasets/${dataset.id}`,
          isActive:
            pathname ===
            `/app/${workspaceSlug}/${teamspace.slug}/datasets/${dataset.id}`,
        })),
      },
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
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentWorkspace?.workspace.name}
                    </span>
                    <span className="truncate text-xs">Basic</span>
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
                <DropdownMenuLabel className="text-muted-foreground mb-2 text-xs">
                  Workspaces
                </DropdownMenuLabel>
                {data.workspaces.map((workspace) => (
                  <Link href={workspace.url} key={workspace.name}>
                    <DropdownMenuItem className="gap-2 p-2">
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <workspace.logo className="size-4 shrink-0" />
                      </div>
                      {workspace.name}
                      {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                  </Link>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2" disabled>
                  <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                    <Plus className="size-4" />
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Add (coming soon)
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
                  <SidebarLeftMenuButton asChild isActive={item.isActive}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                  <SidebarLeftMenuButton
                    asChild
                    isActive={space.project.isActive}
                  >
                    <Link href={space.project.url}>
                      <MapIcon />
                      <span>Projects</span>
                    </Link>
                  </SidebarLeftMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction>
                      <ChevronRightIcon className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {space.project.projects.map((project) => (
                      <SidebarMenuSub key={project.title}>
                        <SidebarMenuSubItem>
                          <SidebarLeftMenuButton
                            asChild
                            isActive={project.isActive}
                          >
                            <Link href={project.url}>
                              {/* <project.icon /> */}
                              <span>{project.title}</span>
                            </Link>
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
                  <SidebarLeftMenuButton
                    asChild
                    isActive={space.dataset.isActive}
                  >
                    <a href={space.dataset.url}>
                      <TableIcon />
                      <span>Datasets</span>
                    </a>
                  </SidebarLeftMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction>
                      <ChevronRightIcon className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuAction>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    {space.dataset.datasets.map((dataset) => (
                      <SidebarMenuSub key={dataset.title}>
                        <SidebarMenuSubItem>
                          <SidebarLeftMenuButton
                            asChild
                            isActive={dataset.isActive}
                          >
                            <Link href={dataset.url}>
                              {/* <project.icon /> */}
                              <span>{dataset.title}</span>
                            </Link>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarLeftMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  size="lg"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage alt={user.name ?? ""} src={data.user.avatar} />
                    <AvatarFallback className="rounded-lg">
                      {data.user.name.split(" ")[0]?.[0]}
                      {data.user.name.split(" ")[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarLeftMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        alt={data.user.name || ""}
                        src={data.user.avatar}
                      />
                      <AvatarFallback className="rounded-lg uppercase">
                        {data.user.name.split(" ")[0]?.[0]}
                        {data.user.name.split(" ")[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onSelect={() => signOutAction()}
                >
                  <LogOutIcon className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarLeft>
  );
}
