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
  BoxIcon,
  Settings2Icon,
  TableIcon,
  ChevronRightIcon,
  LogOutIcon,
  PlusIcon,
  BookOpenIcon,
  BookMarkedIcon,
  HelpCircleIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@mapform/ui/components/collapsible";
import { Avatar, AvatarFallback } from "@mapform/ui/components/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "~/data/auth/sign-out";
import { useAuth } from "~/app/root-providers";
import { useWorkspace } from "../workspace-context";
import { ProjectMenuSubItem } from "./project-menu-sub-item";
import { DatasetMenuSubItem } from "./dataset-menu-sub-item";
import { CreateProjectDialog } from "~/components/create-project-dialog";
import { CreateDatasetDialog } from "~/components/create-dataset-dialog";
import {
  ProjectTour,
  ProjectTourContent,
} from "~/components/tours/project-tour";
import {
  WelcomeTour as WT,
  WelcomeTourContent,
} from "~/components/tours/welcome-tour";
import { useState } from "react";

export function LeftSidebar() {
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
      project: {
        url: `/app/${workspaceSlug}/${teamspace.slug}`,
        isActive: pathname === `/app/${workspaceSlug}/${teamspace.slug}`,
        projects: teamspace.projects.map((project) => ({
          id: project.id,
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
          id: dataset.id,
          title: dataset.name,
          url: `/app/${workspaceSlug}/${teamspace.slug}/datasets/${dataset.id}`,
          isActive:
            pathname ===
            `/app/${workspaceSlug}/${teamspace.slug}/datasets/${dataset.id}`,
          hasProject: !!dataset.project?.id,
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
            {/* Projects */}
            <SidebarMenu>
              <Collapsible className="group/collapsible" defaultOpen>
                <SidebarMenuItem>
                  <SidebarLeftMenuButton
                    asChild
                    isActive={space.project.isActive}
                  >
                    <Link href={space.project.url}>
                      <BoxIcon />
                      <span>Projects</span>
                    </Link>
                  </SidebarLeftMenuButton>
                  <div className="absolute right-1 top-1.5 flex gap-1">
                    <CreateProjectDialog tsSlug={space.slug}>
                      <SidebarMenuAction className="relative right-0 top-0">
                        <PlusIcon />
                      </SidebarMenuAction>
                    </CreateProjectDialog>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="relative right-0 top-0">
                        <ChevronRightIcon className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {space.project.projects.length ? (
                        space.project.projects.map((project) => (
                          <ProjectMenuSubItem
                            key={project.id}
                            project={project}
                            teamspaceSlug={space.slug}
                          />
                        ))
                      ) : (
                        <SidebarMenuSubItem>
                          <SidebarLeftMenuButton disabled>
                            No projects
                          </SidebarLeftMenuButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              {/* Datasets */}
              <Collapsible className="group/collapsible" defaultOpen>
                <SidebarMenuItem>
                  <SidebarLeftMenuButton
                    asChild
                    isActive={space.dataset.isActive}
                  >
                    <Link href={space.dataset.url}>
                      <TableIcon />
                      <span>Datasets</span>
                    </Link>
                  </SidebarLeftMenuButton>

                  <div className="absolute right-1 top-1.5 flex gap-1">
                    <CreateDatasetDialog tsSlug={space.slug}>
                      <SidebarMenuAction className="relative right-0 top-0">
                        <PlusIcon />
                      </SidebarMenuAction>
                    </CreateDatasetDialog>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="relative right-0 top-0">
                        <ChevronRightIcon className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {space.dataset.datasets.length ? (
                        space.dataset.datasets.map((dataset) => (
                          <DatasetMenuSubItem
                            dataset={dataset}
                            key={dataset.id}
                            teamspaceSlug={space.slug}
                          />
                        ))
                      ) : (
                        <SidebarMenuSubItem>
                          <SidebarLeftMenuButton disabled>
                            No datasets
                          </SidebarLeftMenuButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
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
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarLeftMenuButton>
                  <BookMarkedIcon />
                  Guides
                </SidebarLeftMenuButton>
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
                  <BoxIcon className="size-4" />
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
              <SidebarLeftMenuButton>
                <HelpCircleIcon className="size-4" />
                Support
              </SidebarLeftMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarLeftMenuButton
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
    </SidebarLeft>
  );
}
