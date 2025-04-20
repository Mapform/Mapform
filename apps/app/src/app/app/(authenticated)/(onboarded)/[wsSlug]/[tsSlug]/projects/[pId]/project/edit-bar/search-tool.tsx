import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { SearchIcon } from "lucide-react";

interface SearchToolProps {
  isActive: boolean;
  onClick: () => void;
}

export function SearchTool({ isActive, onClick }: SearchToolProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          size="icon"
          variant={isActive ? "default" : "ghost"}
        >
          <SearchIcon className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Search tool</TooltipContent>
    </Tooltip>
  );
}
