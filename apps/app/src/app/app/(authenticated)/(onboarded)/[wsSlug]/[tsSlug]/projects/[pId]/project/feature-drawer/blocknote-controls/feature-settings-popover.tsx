import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { EllipsisIcon, Trash2Icon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";

export const FeatureSettingsPopover = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          // onSelect={onDelete}
          className="flex items-center gap-2"
        >
          <Trash2Icon className="flex-shrink-0 size-4" />
          Delete feature
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeatureSettingsPopover;
