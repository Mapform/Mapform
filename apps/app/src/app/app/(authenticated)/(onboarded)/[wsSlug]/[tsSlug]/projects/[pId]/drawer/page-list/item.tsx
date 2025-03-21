"use client";

import {
  ArrowUpRightIcon,
  EllipsisIcon,
  FileIcon,
  FlagIcon,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mapform/ui/components/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { startTransition } from "react";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import {
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarRightMenuButton,
} from "@mapform/ui/components/sidebar";
import { DragItem, DragHandle } from "~/components/draggable";
import { usePathname, useParams } from "next/navigation";
import { deletePageAction } from "~/data/pages/delete-page";
import { useProject } from "../../project-context";
import { cn } from "@mapform/lib/classnames";
import Link from "next/link";
import { useState } from "react";
import {
  EditPagePopoverRoot,
  EditPagePopoverContent,
  EditPagePopoverAnchor,
} from "./edit-page-popover";

interface ItemProps {
  index: number;
  page: NonNullable<GetProjectWithPages["data"]>["pages"][number];
}

export function Item({ page, index }: ItemProps) {
  const {
    currentProject,
    updateProjectOptimistic,
    setActivePage,
    updatePageServerAction,
  } = useProject();
  const pathname = usePathname();
  const params = useParams<{ wsSlug: string; tsSlug: string; pId: string }>();
  const { executeAsync: executeDeletePage, isPending } =
    useAction(deletePageAction);
  const [editPagePopoverOpen, setEditPagePopoverOpen] = useState(false);

  const isLastPage = currentProject.pages.length <= 1;
  const isActive = page.id === updatePageServerAction.optimisticState?.id;

  const handleDelete = async () => {
    if (isLastPage) return;

    const newPages = currentProject.pages.filter((p) => p.id !== page.id);

    const pageIndex = currentProject.pages.findIndex((p) => p.id === page.id);

    const nextPage =
      currentProject.pages[pageIndex + 1] ||
      currentProject.pages[pageIndex - 1];

    await executeDeletePage({
      pageId: page.id,
      projectId: currentProject.id,
      redirect: nextPage ? `${pathname}?page=${nextPage.id}` : undefined,
    });

    startTransition(() => {
      updateProjectOptimistic({
        ...currentProject,
        pages: newPages,
      });
    });
  };

  const firstEndingIndex = currentProject.pages.findIndex(
    (p) => p.pageType === "page_ending",
  );

  return (
    <DragItem id={page.id} key={page.id}>
      <ContextMenu>
        <ContextMenuTrigger>
          <DragHandle id={page.id}>
            <SidebarMenuItem>
              <SidebarRightMenuButton
                className={cn("pr-8", {
                  "opacity-40":
                    firstEndingIndex > -1 &&
                    index > firstEndingIndex &&
                    !isActive,
                  "opacity-70":
                    firstEndingIndex > -1 &&
                    index > firstEndingIndex &&
                    isActive,
                })}
                disabled={isPending}
                isActive={isActive}
                onClick={() => {
                  setActivePage(page);
                }}
              >
                {page.icon ? (
                  <span className="text-lg">{page.icon}</span>
                ) : page.pageType === "page" ? (
                  <FileIcon />
                ) : (
                  <FlagIcon />
                )}
                <span
                  className={cn("truncate text-sm", {
                    "text-muted-foreground": isPending,
                  })}
                >
                  {page.title || "Untitled"}
                </span>
              </SidebarRightMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
                    <EllipsisIcon />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] overflow-hidden"
                  side="left"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2"
                    >
                      <Link
                        href={`/app/${params.wsSlug}/${params.tsSlug}/projects/${params.pId}?page=${page.id}`}
                      >
                        <ArrowUpRightIcon className="size-4 flex-shrink-0" />
                        Visit Page
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={() => {
                        setEditPagePopoverOpen(true);
                      }}
                    >
                      <Settings2Icon className="size-4 flex-shrink-0" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      disabled={isPending || currentProject.pages.length <= 1}
                      onClick={handleDelete}
                    >
                      <Trash2Icon className="size-4 flex-shrink-0" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </DragHandle>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem asChild>
            <Link
              href={`/app/${params.wsSlug}/${params.tsSlug}/projects/${params.pId}?page=${page.id}`}
            >
              Visit Page
            </Link>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setEditPagePopoverOpen(true)}>
            Edit
          </ContextMenuItem>
          <ContextMenuItem disabled={isLastPage} onClick={handleDelete}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <EditPagePopoverRoot
        modal
        onOpenChange={setEditPagePopoverOpen}
        open={editPagePopoverOpen}
      >
        <EditPagePopoverAnchor />
        <EditPagePopoverContent
          pageId={page.id}
          initialTitle={page.title ?? ""}
          side="left"
          onClose={() => {
            setEditPagePopoverOpen(false);
          }}
        />
      </EditPagePopoverRoot>
    </DragItem>
  );
}
