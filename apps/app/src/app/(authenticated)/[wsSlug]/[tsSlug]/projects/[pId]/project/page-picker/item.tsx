"use client";

import { PanelLeftIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mapform/ui/components/context-menu";
import { DragItem, DragHandle } from "~/components/draggable";
import type { ProjectWithPages } from "~/data/projects/get-project-with-pages";
import { PageBarButton } from "../page-bar-button";
import { useAction } from "next-safe-action/hooks";
import { deletePage } from "~/data/pages/delete-page";
import { usePage } from "../../page-context";
import { useProject } from "../../project-context";
import { startTransition } from "react";

interface ItemProps {
  page: ProjectWithPages["pages"][number];
}

export function Item({ page }: ItemProps) {
  const { setActivePage, optimisticPage } = usePage();
  const { optimisticProjectWithPages, updateProjectWithPages } = useProject();
  const { execute: executeDeletePage } = useAction(deletePage);

  const isLastPage = optimisticProjectWithPages.pages.length <= 1;
  const isActive = page.id === optimisticPage?.id;

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
            <PageBarButton
              Icon={PanelLeftIcon}
              isActive={isActive}
              isSubtle
              onClick={() => setActivePage(page)}
            >
              {page.title || "Untitled"}
            </PageBarButton>
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
