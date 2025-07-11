import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { Button } from "@mapform/ui/components/button";
import { VIEWS } from "~/constants/views";
import { useProject } from "../context";
import { projectSearchParams, projectSearchParamsUrlKeys } from "../params";
import { useQueryStates } from "nuqs";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createViewAction } from "~/data/views/create-view";

export function ViewSelector() {
  const { project, activeView } = useProject();
  const [_, setProjectSearchParams] = useQueryStates(projectSearchParams, {
    urlKeys: projectSearchParamsUrlKeys,
    shallow: false,
  });
  const { execute, isPending } = useAction(createViewAction);

  if (!activeView) {
    return null;
  }

  const ViewIcon = VIEWS[activeView.type].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-0" variant="secondary">
          <ViewIcon className="mr-1.5 size-4" />
          {VIEWS[activeView.type].name}
          <ChevronDownIcon className="text-muted-foreground ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {project.views.map((view) => {
          const ViewIcon = VIEWS[view.type].icon;
          const isActive = view.id === activeView.id;

          return (
            <DropdownMenuItem
              key={view.id}
              onSelect={() => {
                void setProjectSearchParams({ viewId: view.id });
              }}
            >
              <ViewIcon className="size-4" />
              {VIEWS[view.type].name}
              {isActive && <CheckIcon className="ml-auto size-4" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2">
            <PlusIcon className="text-muted-foreground size-4" />
            <span>Add View</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuContent align="start" side="right">
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
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
