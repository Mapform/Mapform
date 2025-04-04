import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { EllipsisIcon, Trash2Icon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { useAction } from "next-safe-action/hooks";
import { startTransition } from "react";
import { usePathname } from "next/navigation";
import { deletePageAction } from "~/data/pages/delete-page";
import { useProject } from "../../project-context";
import { toast } from "@mapform/ui/components/toaster";

export const FeatureSettingsPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentProject, updateProjectOptimistic, updatePageServerAction } =
    useProject();
  const pathname = usePathname();

  const { executeAsync: executeDeletePage, isPending } = useAction(
    deletePageAction,
    {
      onError: ({ error }) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description:
            error.serverError ?? "There was an error deleting the page.",
        });
      },
    },
  );

  const currentPage = updatePageServerAction.optimisticState;
  const isLastPage = currentProject.pages.length <= 1;

  const handleDelete = async () => {
    if (!currentPage || isLastPage) return;

    const pageIndex = currentProject.pages.findIndex(
      (p) => p.id === currentPage.id,
    );

    const nextPage =
      currentProject.pages[pageIndex + 1] ||
      currentProject.pages[pageIndex - 1];

    await executeDeletePage({
      pageId: currentPage.id,
      projectId: currentProject.id,
      redirect: nextPage ? `${pathname}?page=${nextPage.id}` : undefined,
    });

    const newPages = currentProject.pages.filter(
      (p) => p.id !== currentPage.id,
    );
    startTransition(() => {
      updateProjectOptimistic({
        ...currentProject,
        pages: newPages,
      });
    });
  };

  const isDisabled =
    isPending ||
    currentProject.pages.length <= 1 ||
    (currentPage?.pageType === "page_ending" &&
      currentProject.formsEnabled &&
      currentProject.pages.filter((p) => p.pageType === "page_ending").length <=
        1);

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" type="button" variant="ghost">
          <EllipsisIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        className="w-[200px] overflow-hidden"
      >
        <DropdownMenuItem
          onSelect={handleDelete}
          className="flex items-center gap-2"
          disabled={isDisabled}
        >
          <Trash2Icon className="flex-shrink-0 size-4" />
          Delete page
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeatureSettingsPopover;
