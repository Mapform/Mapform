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
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarGroupAction,
} from "@mapform/ui/components/sidebar";
import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  HomeIcon,
  BoxIcon,
  Settings2Icon,
  ChevronRightIcon,
  LogOutIcon,
  PlusIcon,
  BookOpenIcon,
  BookMarkedIcon,
  HelpCircleIcon,
  CirclePlusIcon,
  FolderIcon,
  FolderOpenIcon,
  EarthIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@mapform/ui/components/collapsible";
import { Avatar, AvatarFallback } from "@mapform/ui/components/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "~/data/auth/sign-out";
import { useAuth } from "~/app/root-providers";
import { useWorkspace } from "../workspace-context";
import {
  ProjectTour,
  ProjectTourContent,
} from "~/components/tours/project-tour";
import {
  WelcomeTour as WT,
  WelcomeTourContent,
} from "~/components/tours/welcome-tour";
import { useState } from "react";
import { Files } from "./files";
import { createProjectAction } from "~/data/projects/create-project";
import { useAction } from "next-safe-action/hooks";
import { toast } from "@mapform/ui/components/toaster";
import { useMap } from "react-map-gl/mapbox";

export function AppSidebar() {
  const map = useMap();
  const { user } = useAuth();
  const pathname = usePathname();
  const { workspaceMemberships, workspaceDirectory, workspaceSlug } =
    useWorkspace();
  const [isProjectGuideOpen, setIsProjectGuideOpen] = useState(false);
  const [isWelcomeGuideOpen, setIsWelcomeGuideOpen] = useState(false);
  const { execute, isPending } = useAction(createProjectAction, {
    onError: ({ error }) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          error.serverError ?? "There was an error creating the project.",
      });
    },
  });

  if (!user) {
    return null;
  }

  const data = {
    user: {
      name: user.name ?? "No Name",
      email: user.email,
      // avatar: "/avatars/shadcn.jpg", // TODO: Use real avatar
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
  };

  return (
    <Sidebar
      className="[data-slot='sidebar-inner']:bg-sidebar/90 [data-slot='sidebar-inner']:backdrop-blur-md group-data-[variant=floating]:bg-transparent"
      variant="floating"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  size="lg"
                >
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {workspaceDirectory.name}
                    </span>
                    <span className="truncate text-xs">Basic</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
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
                    <PlusIcon className="size-4" />
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
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {workspaceDirectory.teamspaces.map((teamspace) => (
          <SidebarGroup key={teamspace.id}>
            <SidebarGroupLabel>{teamspace.name}</SidebarGroupLabel>
            <SidebarGroupAction
              title="Add Project"
              disabled={isPending}
              onClick={() => {
                execute({
                  teamspaceId: teamspace.id,
                  viewType: "map",
                  center: map.current?.getCenter().toArray() as [
                    number,
                    number,
                  ],
                });
              }}
            >
              <PlusIcon />
            </SidebarGroupAction>
            <Files teamspace={teamspace} />
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <BookMarkedIcon />
                  Guides
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="right" sideOffset={4}>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => {
                    setIsWelcomeGuideOpen(true);
                  }}
                >
                  <BookOpenIcon className="size-4" />
                  Welcome Note
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => {
                    setIsProjectGuideOpen(true);
                  }}
                >
                  <EarthIcon className="size-4" />
                  Projects Overview
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <WT open={isWelcomeGuideOpen} onOpenChange={setIsWelcomeGuideOpen}>
              <WelcomeTourContent />
            </WT>
            <ProjectTour
              open={isProjectGuideOpen}
              onOpenChange={setIsProjectGuideOpen}
            >
              <ProjectTourContent />
            </ProjectTour>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="mailto:support@mapform.co">
              <SidebarMenuButton>
                <HelpCircleIcon className="size-4" />
                Support
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  size="lg"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {/* <AvatarImage alt={user.name ?? ""} src={data.user.avatar} /> */}
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
                </SidebarMenuButton>
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
                      {/* <AvatarImage
                        alt={data.user.name || ""}
                        src={data.user.avatar}
                      /> */}
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
    </Sidebar>
  );
}
