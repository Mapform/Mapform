"use client";

import { EllipsisIcon, FileIcon, Trash2Icon } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { startTransition } from "react";
import type { ProjectWithPages } from "@mapform/backend/projects/get-project-with-pages";
import {
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarRightMenuButton,
} from "@mapform/ui/components/sidebar";
import { DragItem, DragHandle } from "~/components/draggable";
import { deletePageAction } from "~/data/pages/delete-page";
import { useProject } from "../../project-context";

interface ItemProps {
  page: ProjectWithPages["pages"][number];
}

export function Item({ page }: ItemProps) {
  const {
    optimisticProjectWithPages,
    updateProjectWithPages,
    setActivePage,
    currentPage,
  } = useProject();
  const { execute: executeDeletePage } = useAction(deletePageAction);

  const isLastPage = optimisticProjectWithPages.pages.length <= 1;
  const isActive = page.id === currentPage?.id;

  const handleDelete = () => {
    if (isLastPage) return;

    const newPages = optimisticProjectWithPages.pages.filter(
      (p) => p.id !== page.id,
    );

    if (isActive) {
      const pageIndex = optimisticProjectWithPages.pages.findIndex(
        (p) => p.id === page.id,
      );

      const nextPage =
        optimisticProjectWithPages.pages[pageIndex + 1] ||
        optimisticProjectWithPages.pages[pageIndex - 1];

      nextPage && setActivePage(nextPage);
    }

    executeDeletePage({
      pageId: page.id,
      projectId: optimisticProjectWithPages.id,
    });

    startTransition(() => {
      updateProjectWithPages({
        ...optimisticProjectWithPages,
        pages: newPages,
      });
    });
  };

  return (
    <DragItem id={page.id} key={page.id}>
      <ContextMenu>
        <ContextMenuTrigger>
          <DragHandle id={page.id}>
            <SidebarMenuItem>
              <SidebarRightMenuButton
                className="pr-8"
                isActive={isActive}
                onClick={() => {
                  setActivePage(page);
                }}
              >
                {page.icon ? (
                  <span className="text-lg">{page.icon}</span>
                ) : (
                  <FileIcon />
                )}
                <span className="truncate text-sm">
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
                      className="flex items-center gap-2"
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
          <ContextMenuItem disabled={isLastPage} onClick={handleDelete}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </DragItem>
  );
}
