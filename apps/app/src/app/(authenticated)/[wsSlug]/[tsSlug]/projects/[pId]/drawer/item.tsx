"use client";

import { EllipsisIcon, FileIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mapform/ui/components/context-menu";
import { DragItem, DragHandle } from "~/components/draggable";
import type { ProjectWithPages } from "~/data/projects/get-project-with-pages";
// import { PageBarButton } from "../page-bar-button";
import { useAction } from "next-safe-action/hooks";
import { deletePage } from "~/data/pages/delete-page";
import { usePage } from "../page-context";
import { useProject } from "../project-context";
import { startTransition } from "react";

interface ItemProps {
  page: ProjectWithPages["pages"][number];
}

export function Item({ page }: ItemProps) {
  const { setActivePage, optimisticPage } = usePage();
  const { optimisticProjectWithPages, updateProjectWithPages } = useProject();
  const { execute: executeDeletePage } = useAction(deletePage);

  const isLastPage = optimisticProjectWithPages.pages.length <= 1;
  const isActive = true;

  const onDelete = () => {
    if (isLastPage) return;

    const newPages = optimisticProjectWithPages.pages.filter(
      (p) => p.id !== page.id
    );

    executeDeletePage({
      pageId: page.id,
      projectId: optimisticProjectWithPages.id,
    });

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
            {/* <Button>{page.title || "Untitled"}</Button> */}
            <div className="-mx-3 hover:bg-stone-100 px-3 py-1.5 rounded transition-colors flex items-center justify-between mb-[2px] group">
              <div className="flex flex-1 items-center gap-2 overflow-hidden">
                <FileIcon className="size-4 flex items-center justify-center flex-shrink-0" />
                <span className="truncate mr-auto">
                  {page.title || "Untitled"}
                </span>
                <EllipsisIcon className="size-4 flex items-center justify-center flex-shrink-0 invisible transition-opacity group-hover:visible" />
              </div>
            </div>
            {/* <PageBarButton
              Icon={PanelLeftIcon}
              isActive={isActive}
              isSubtle
              onClick={() => setActivePage(page)}
            >
              {page.title || "Untitled"}
            </PageBarButton> */}
          </DragHandle>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled={isLastPage} onClick={onDelete}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </DragItem>
  );
}
