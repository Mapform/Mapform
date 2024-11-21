import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@mapform/ui/components/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@mapform/ui/components/dropdown-menu";
import {
  SidebarMenuSubItem,
  SidebarLeftMenuButton,
  SidebarMenuAction,
} from "@mapform/ui/components/sidebar";
import { EllipsisIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { RenameProjectPopover } from "~/components/rename-project-popover";
import { deleteProjectAction } from "~/data/projects/delete-project";

interface ProjectMenuSubItemProps {
  project: {
    id: string;
    title: string;
    url: string;
    isActive: boolean;
  };
}

export function ProjectMenuSubItem({ project }: ProjectMenuSubItemProps) {
  const { execute: executeDeleteProject, status: statusDeleteProject } =
    useAction(deleteProjectAction);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

  return (
    <SidebarMenuSubItem>
      <RenameProjectPopover
        onOpenChange={setPopoverOpen}
        open={popoverOpen}
        project={project}
      >
        <SidebarLeftMenuButton
          asChild
          className="pr-8"
          isActive={project.isActive}
        >
          <Link href={project.url}>
            {/* <project.icon /> */}
            <span>{project.title}</span>
          </Link>
        </SidebarLeftMenuButton>
      </RenameProjectPopover>
      <DropdownMenu onOpenChange={setDropdownMenuOpen} open={dropdownMenuOpen}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <EllipsisIcon />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right">
          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={(e) => {
              e.preventDefault();
              setDropdownMenuOpen(false);
              setPopoverOpen(true);
            }}
          >
            <SquarePenIcon className="size-4 flex-shrink-0" />
            Rename
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <Trash2Icon className="size-4 flex-shrink-0" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your project and related data will be permanently deleted.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={statusDeleteProject === "executing"}
                  onClick={() => {
                    executeDeleteProject({
                      projectId: project.id,
                    });
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuSubItem>
  );
}
