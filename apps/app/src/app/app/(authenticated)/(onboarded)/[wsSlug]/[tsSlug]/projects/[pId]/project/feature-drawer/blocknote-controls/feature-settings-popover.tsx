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
import { deleteRowsAction } from "~/data/rows/delete-rows";
import { useProject } from "../../../project-context";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";
import { toast } from "@mapform/ui/components/toaster";

export const FeatureSettingsPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedFeature } = useProject();
  const setQueryString = useSetQueryString();

  const { execute: executeDeleteRows, isPending } = useAction(
    deleteRowsAction,
    {
      onError: ({ error }) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description:
            error.serverError ?? "There was an error deleting the feature.",
        });
      },
    },
  );

  const handleDelete = () => {
    if (!selectedFeature) return;

    executeDeleteRows({
      rowIds: [selectedFeature.rowId],
    });

    // Clear the feature from the URL
    setQueryString({
      key: "feature",
      value: null,
    });
  };

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
          disabled={isPending}
        >
          <Trash2Icon className="flex-shrink-0 size-4" />
          Delete feature
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeatureSettingsPopover;
