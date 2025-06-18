"use client";

import { Button } from "@mapform/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useState } from "react";
import { VIEWS } from "~/constants/views";
import { QUERY_PARAMS } from "~/constants/query-params";
import type { GetProject } from "@mapform/backend/data/projects/get-project";
import { TrashIcon } from "lucide-react";
import { useProject } from "../context";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";

export const ViewButton = ({
  view,
}: {
  view: NonNullable<GetProject["data"]>["views"][number];
}) => {
  const { activeView } = useProject();
  const setQueryString = useSetQueryString();

  const viewType = view.type;
  const ViewIcon = VIEWS[viewType].icon;
  const isActive = activeView?.id === view.id;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(newState) => {
        if (isActive) {
          setIsOpen(newState);
        } else if (newState) {
          setQueryString({
            key: QUERY_PARAMS.VIEW,
            value: view.id,
          });
        } else {
          setIsOpen(false);
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant={isActive ? "secondary" : "outline"}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          <ViewIcon className="mr-2 size-4" />
          <span>{view.name ?? VIEWS[viewType].name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <TrashIcon className="mr-2 size-4" />
          <span>Delete View</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
