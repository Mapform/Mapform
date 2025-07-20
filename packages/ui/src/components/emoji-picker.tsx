import Picker from "@emoji-mart/react";
import { CircleXIcon } from "lucide-react";
import data from "@emoji-mart/data";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { Button } from "@mapform/ui/components/button";

export function EmojiPicker({
  onIconChange,
}: {
  onIconChange?: (icon: string | null) => void;
}) {
  return (
    <Picker
      data={data}
      onEmojiSelect={(e: { native: string }) => {
        onIconChange && onIconChange(e.native);
      }}
      skinTonePosition="search"
      theme="light"
    />
  );
}

export function EmojiPopover({
  children,
  onIconChange,
}: {
  children: React.ReactNode;
  onIconChange?: (icon: string | null) => void;
}) {
  if (!onIconChange) {
    return children;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-full overflow-hidden bg-none p-0">
        <Picker
          data={data}
          onEmojiSelect={(e: { native: string }) => {
            onIconChange(e.native);
          }}
          skinTonePosition="search"
          theme="light"
        />
        <Button
          aria-label="Remove"
          className="absolute bottom-[19px] right-4 z-10"
          onClick={() => {
            onIconChange(null);
          }}
          size="icon-sm"
          variant="secondary"
        >
          <CircleXIcon className="size-4" />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
