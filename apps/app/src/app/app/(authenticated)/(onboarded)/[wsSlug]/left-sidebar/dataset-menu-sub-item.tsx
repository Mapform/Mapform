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
import { RenameDatasetPopover } from "~/components/rename-dataset-popover";
import { deleteDatasetAction } from "~/data/datasets/delete-dataset";
import { useWorkspace } from "../workspace-context";
import { toast } from "@mapform/ui/components/toaster";

interface DatasetMenuSubItemProps {
  dataset: {
    id: string;
    title: string;
    url: string;
    isActive: boolean;
  };
  teamspaceSlug: string;
}

export function DatasetMenuSubItem({
  dataset,
  teamspaceSlug,
}: DatasetMenuSubItemProps) {
  const { execute: executeDeleteDataset, status: statusDeleteDataset } =
    useAction(deleteDatasetAction, {
      onError: ({ error }) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.serverError,
        });
      },
    });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  const { workspaceSlug } = useWorkspace();

  return (
    <SidebarMenuSubItem>
      <RenameDatasetPopover
        dataset={dataset}
        key={dataset.title}
        onOpenChange={setPopoverOpen}
        open={popoverOpen}
      >
        <SidebarLeftMenuButton
          asChild
          className="pr-8"
          isActive={dataset.isActive}
        >
          <Link href={`/app/${workspaceSlug}/redirect?url=${dataset.url}`}>
            <span>{dataset.title || "Untitled"}</span>
          </Link>
        </SidebarLeftMenuButton>
      </RenameDatasetPopover>
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
                  Your data will be permanently deleted. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={statusDeleteDataset === "executing"}
                  onClick={() => {
                    executeDeleteDataset({
                      datasetId: dataset.id,
                      redirect: dataset.isActive
                        ? `/app/${workspaceSlug}/${teamspaceSlug}/datasets`
                        : undefined,
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
