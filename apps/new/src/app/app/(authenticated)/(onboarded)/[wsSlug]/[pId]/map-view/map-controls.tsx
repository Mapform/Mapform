import { Button } from "@mapform/ui/components/button";
import { ButtonGroup } from "@mapform/ui/components/button-group";
import { MinusIcon, PlusIcon, SearchIcon, Settings2Icon } from "lucide-react";

export function MapControls() {
  return (
    <div className="absolute right-2 top-2 flex flex-col gap-1">
      <Button size="icon-sm" variant="outline">
        <SearchIcon className="size-4" />
      </Button>
      <Button size="icon-sm" variant="outline">
        <Settings2Icon className="size-4" />
      </Button>
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
