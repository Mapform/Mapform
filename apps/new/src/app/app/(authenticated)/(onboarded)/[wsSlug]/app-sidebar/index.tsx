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
import { CreateProjectDropdown } from "~/components/create-project-dialog";
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
import { createFolderAction } from "~/data/folders/create-folder";

export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const {
    workspaceMemberships,
    workspaceDirectory,
    workspaceSlug,
    currentWorkspace,
  } = useWorkspace();
  const [isProjectGuideOpen, setIsProjectGuideOpen] = useState(false);
  const [isWelcomeGuideOpen, setIsWelcomeGuideOpen] = useState(false);

  const { execute: executeCreateProject, isPending: isCreateProjectPending } =
    useAction(createProjectAction, {
      onError: ({ error }) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description:
            error.serverError ?? "There was an error creating the project.",
        });
      },
    });

  const { execute: executeCreateFolder, isPending: isCreateFolderPending } =
    useAction(createFolderAction, {
      onError: ({ error }) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description:
            error.serverError ?? "There was an error creating the folder.",
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
    spaces: workspaceDirectory.teamspaces.map((teamspace) => ({
      id: teamspace.id,
      slug: teamspace.slug,
      title: teamspace.name,
      projects: teamspace.projects.map((project) => ({
        id: project.id,
        title: project.name,
        icon: project.icon,
        url: `/app/${workspaceSlug}/${project.id}`,
        fileTreePosition: {
          position: project.fileTreePosition?.position,
          parentId: project.fileTreePosition?.parentId,
          itemType: project.fileTreePosition?.itemType,
          id: project.fileTreePosition?.id,
        },
      })),
      folders: teamspace.folders.map((folder) => ({
        id: folder.id,
        title: folder.name,
        icon: folder.icon,
        url: `/app/${workspaceSlug}/${folder.id}`,
        fileTreePosition: {
          position: folder.fileTreePosition?.position,
          parentId: folder.fileTreePosition?.parentId,
          itemType: folder.fileTreePosition?.itemType,
          id: folder.fileTreePosition?.id,
        },
      })),
    })),
  };

  return (
    <Sidebar>
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
                      {currentWorkspace?.workspace.name}
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
        {data.spaces.map((space) => (
          <SidebarGroup key={space.title}>
            <SidebarGroupLabel>{space.title}</SidebarGroupLabel>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarGroupAction title="Add Project">
                  <PlusIcon />
                </SidebarGroupAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={() => {
                    console.log("Creating project");
                    executeCreateProject({
                      teamspaceId: space.id,
                      viewType: "map",
                    });
                  }}
                  disabled={isCreateProjectPending}
                >
                  <EarthIcon /> New project
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    executeCreateFolder({
                      teamspaceId: space.id,
                    });
                  }}
                  disabled={isCreateFolderPending}
                >
                  <FolderOpenIcon /> New folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Files space={space} />
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
