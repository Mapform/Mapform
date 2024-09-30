import { Button } from "@mapform/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { ChevronRightIcon } from "lucide-react";
import type { GeoJson } from "@infra-blocks/zod-utils/geojson";
import {
  QuickCreateDialog,
  QuickCreateContent,
  QuickCreateDialogTrigger,
} from "./quick-create-dialog";

interface AddLocationDropdownProps {
  data: GeoJson;
}

export function AddLocationDropdown({ data }: AddLocationDropdownProps) {
  return (
    <QuickCreateDialog>
      <QuickCreateContent data={data} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button">
            Add to
            <ChevronRightIcon className="ml-2 size-4 -mr-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]" align="end" side="right">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Layers</DropdownMenuLabel>
            <div className="text-center rounded bg-gray-100 p-2 text-muted-foreground text-sm">
              No Layers
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <QuickCreateDialogTrigger>+ New Layer</QuickCreateDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </QuickCreateDialog>
  );
}
