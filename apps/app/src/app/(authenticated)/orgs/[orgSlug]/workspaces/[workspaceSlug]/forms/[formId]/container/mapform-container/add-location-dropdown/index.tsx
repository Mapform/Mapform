import { Button } from "@mapform/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@mapform/ui/components/dropdown-menu";
import { ChevronRightIcon } from "lucide-react";
import type { GeoJson } from "@infra-blocks/zod-utils/geojson";
import {
  QuickCreateDialog,
  QuickCreateContent,
  QuickCreateDialogTrigger,
} from "./quick-create-dialog";

interface AddLocationDropdownProps {
  stepId: string;
  formId: string;
  data: GeoJson;
}

export function AddLocationDropdown({
  stepId,
  formId,
  data,
}: AddLocationDropdownProps) {
  return (
    <QuickCreateDialog>
      <QuickCreateContent data={data} formId={formId} stepId={stepId} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button">
            Add to
            <ChevronRightIcon className="ml-2 size-4 -mr-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <DropdownMenuGroup>
            <DropdownMenuItem className="font-semibold">
              <QuickCreateDialogTrigger>
                + Quick create
              </QuickCreateDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Layers</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuItem>+ Add to new data layer</DropdownMenuItem>
              <DropdownMenuSubTrigger>
                Add to existing data layer
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Layer 1</DropdownMenuItem>
                  <DropdownMenuItem>Layer 2</DropdownMenuItem>
                  <DropdownMenuItem>Layer 3</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          {/* <DropdownMenuLabel>Layers</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </QuickCreateDialog>
  );
}
