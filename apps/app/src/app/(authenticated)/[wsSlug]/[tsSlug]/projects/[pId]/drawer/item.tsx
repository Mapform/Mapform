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
import { DragItem, DragHandle } from "~/components/draggable";
import type { ProjectWithPages } from "~/data/projects/get-project-with-pages";
import { useAction } from "next-safe-action/hooks";
import { deletePage } from "~/data/pages/delete-page";
import { usePage } from "../page-context";
import { useProject } from "../project-context";
import { startTransition } from "react";
import { Button } from "@mapform/ui/components/button";
import { cn } from "@mapform/lib/classnames";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";

interface ItemProps {
  page: ProjectWithPages["pages"][number];
}

export function Item({ page }: ItemProps) {
  const { setActivePage, optimisticPage } = usePage();
  const { optimisticProjectWithPages, updateProjectWithPages } = useProject();
  const { execute: executeDeletePage } = useAction(deletePage);

  const isLastPage = optimisticProjectWithPages.pages.length <= 1;
  const isActive = page.id === optimisticPage?.id;

  const handleDelete = () => {
    if (isLastPage) return;

    const newPages = optimisticProjectWithPages.pages.filter(
      (p) => p.id !== page.id
    );

    if (isActive) {
      const pageIndex = optimisticProjectWithPages.pages.findIndex(
        (p) => p.id === page.id
      );

      const nextPage =
        optimisticProjectWithPages.pages[pageIndex + 1] ||
        optimisticProjectWithPages.pages[pageIndex - 1];

      console.log("nextPage", nextPage);

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
            <div
              className={cn(
                "-mx-3 hover:bg-stone-100 rounded transition-colors flex items-center justify-between mb-[2px] group pr-3 cursor-pointer",
                {
                  "bg-stone-100": isActive,
                }
              )}
            >
              <div className="flex flex-1 items-center overflow-hidden -mr-1">
                <button
                  className="flex flex-1 items-center gap-2 overflow-hidden py-1.5 pl-3"
                  onClick={() => setActivePage(page)}
                >
                  <FileIcon className="size-4 flex items-center justify-center flex-shrink-0" />
                  <span className="truncate text-sm">
                    {page.title || "Untitled"}
                  </span>
                </button>
                <DropdownMenu>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="hover:bg-stone-200 !ring-0 !ring-offset-0 !ring-transparent !ring-opacity-0"
                            variant="ghost"
                            size="icon-xs"
                          >
                            <EllipsisIcon className="size-4 flex items-center justify-center flex-shrink-0 invisible transition-opacity group-hover:visible" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <DropdownMenuContent className="w-[200px] overflow-hidden">
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
                      <TooltipContent side="bottom">
                        Delete or duplicate
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </DropdownMenu>
              </div>
            </div>
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
