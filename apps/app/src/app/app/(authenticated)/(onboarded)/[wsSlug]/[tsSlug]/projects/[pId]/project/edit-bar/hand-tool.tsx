import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { HandIcon } from "lucide-react";

interface HandToolProps {
  isActive: boolean;
  isSearchOpen: boolean;
  onClick: () => void;
}

export function HandTool({ isActive, isSearchOpen, onClick }: HandToolProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          size="icon"
          variant={isActive && !isSearchOpen ? "default" : "ghost"}
        >
          <HandIcon className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Hand tool</p>
      </TooltipContent>
    </Tooltip>
  );
}
