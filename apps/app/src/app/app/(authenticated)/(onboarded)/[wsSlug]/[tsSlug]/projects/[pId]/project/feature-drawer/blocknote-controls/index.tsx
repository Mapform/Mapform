import { Button } from "@mapform/ui/components/button";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { SmilePlusIcon } from "lucide-react";
import { PropertiesPopover } from "./properties-popover";
import { FeatureSettingsPopover } from "./feature-settings-popover";
interface BlocknoteControlsProps {
  onIconChange?: (icon: string | null) => void;
  allowAddEmoji?: boolean;
}

export function BlocknoteControls({
  onIconChange,
  allowAddEmoji,
}: BlocknoteControlsProps) {
  return (
    <>
      {allowAddEmoji && (
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
      )}
      <PropertiesPopover />
      <FeatureSettingsPopover />
      {/* <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon-sm" type="button" variant="ghost">
            <ImagePlusIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add cover</TooltipContent>
      </Tooltip> */}
    </>
  );
}
