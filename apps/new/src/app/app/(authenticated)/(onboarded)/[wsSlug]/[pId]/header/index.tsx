import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { VIEWS } from "~/constants/views";
import { Button } from "@mapform/ui/components/button";
import { PlusIcon, SmilePlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { createViewAction } from "~/data/views/create-view";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useProject } from "../context";
import { ViewButton } from "./view-button";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { project } = useProject();

  const { execute, isPending } = useAction(createViewAction);

  return (
    <header className={className}>
      <Tooltip>
        <EmojiPopover onIconChange={() => {}}>
          <TooltipTrigger asChild>
            <Button size="icon-sm" type="button" variant="ghost">
              <SmilePlusIcon className="size-4" />
            </Button>
          </TooltipTrigger>
        </EmojiPopover>
        <TooltipContent>Add emoji</TooltipContent>
      </Tooltip>
      <AutoSizeTextArea
        className="text-4xl font-bold"
        placeholder="Untitled"
        value={project.name ?? ""}
        onChange={(value) => {
          console.log(value);
        }}
      />
      <AutoSizeTextArea
        placeholder="Description"
        value={project.description ?? ""}
        onChange={(value) => {
          console.log(value);
        }}
      />
      <div className="flex gap-1">
        {project.views.map((view) => (
          <ViewButton key={view.id} view={view} />
        ))}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                  <PlusIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Add View</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => {
                execute({ projectId: project.id, viewType: "map" });
              }}
            >
              <VIEWS.map.icon className="size-4" />
              <span>{VIEWS.map.name} View</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                execute({ projectId: project.id, viewType: "table" });
              }}
            >
              <VIEWS.table.icon className="size-4" />
              <span>{VIEWS.table.name} View</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
