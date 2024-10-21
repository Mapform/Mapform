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
import { Button } from "@mapform/ui/components/button";
import { cn } from "@mapform/lib/classnames";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { DragItem, DragHandle } from "~/components/draggable";
import type { ProjectWithPages } from "~/data/projects/get-project-with-pages";
import { deletePage } from "~/data/pages/delete-page";
import { usePage } from "../../page-context";
import { useProject } from "../../project-context";

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
            <div
              className={cn(
                "group -mx-2 mb-[2px] flex cursor-pointer items-center justify-between rounded pr-2 transition-colors hover:bg-stone-100",
                {
                  "bg-stone-100": isActive,
                },
              )}
            >
              <div className="-mr-1 flex flex-1 items-center overflow-hidden">
                <button
                  className="flex flex-1 items-center gap-2 overflow-hidden py-1.5 pl-2"
                  onClick={() => {
                    setActivePage(page);
                  }}
                >
                  <FileIcon className="flex size-4 flex-shrink-0 items-center justify-center" />
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
                            className="!ring-0 !ring-transparent !ring-opacity-0 !ring-offset-0 hover:bg-stone-200"
                            size="icon-xs"
                            variant="ghost"
                          >
                            <EllipsisIcon className="invisible flex size-4 flex-shrink-0 items-center justify-center transition-opacity group-hover:visible" />
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
                        Delete or edit
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
