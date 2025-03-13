import { Button } from "@mapform/ui/components/button";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { SmilePlusIcon, ImagePlusIcon } from "lucide-react";
import { PropertiesPopover } from "./properties-popover";

interface BlocknoteControlsProps {
  onIconChange?: (icon: string | null) => void;
}

export function BlocknoteControls({ onIconChange }: BlocknoteControlsProps) {
  return (
    <>
      <Tooltip>
        <EmojiPopover onIconChange={onIconChange}>
          <TooltipTrigger asChild>
            <Button size="icon-sm" type="button" variant="ghost">
              <SmilePlusIcon className="size-4" />
            </Button>
          </TooltipTrigger>
        </EmojiPopover>
        <TooltipContent>Add emoji</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon-sm" type="button" variant="ghost">
            <ImagePlusIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add image</TooltipContent>
      </Tooltip>
      <PropertiesPopover />
    </>
  );
}
