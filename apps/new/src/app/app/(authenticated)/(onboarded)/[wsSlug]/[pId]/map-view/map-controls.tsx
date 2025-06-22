import { Button } from "@mapform/ui/components/button";
import { ButtonGroup } from "@mapform/ui/components/button-group";
import { MinusIcon, PlusIcon, SearchIcon, Settings2Icon } from "lucide-react";

export function MapControls() {
  return (
    <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
      <div className="flex gap-1">
        <Button size="sm" variant="outline">
          <SearchIcon className="-ml-0.5 mr-1.5 size-4" /> Search
        </Button>
        <Button size="icon-sm" variant="outline">
          <Settings2Icon className="size-4" />
        </Button>
      </div>
      <ButtonGroup orientation="vertical">
        <Button size="icon-sm" variant="outline">
          <PlusIcon className="size-4" />
        </Button>
        <Button size="icon-sm" variant="outline">
          <MinusIcon className="size-4" />
        </Button>
      </ButtonGroup>
    </div>
  );
}
