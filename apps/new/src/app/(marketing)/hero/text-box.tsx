import { Button } from "@mapform/ui/components/button";
import { SearchIcon, SendIcon } from "lucide-react";
import StreamingText from "./streaming-text";

interface TextBoxProps {
  text: string;
}

export function TextBox({ text }: TextBoxProps) {
  return (
    <div className="absolute bottom-0 flex w-full flex-col gap-4 rounded-2xl bg-white/70 p-4 shadow-[0_5px_15px_-3px_rgba(0,0,0,0.15)] backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <SearchIcon className="text-muted-foreground size-5" />
        <StreamingText text={text} />
      </div>
      <Button className="ml-auto" type="submit" size="icon" tabIndex={-1}>
        <SendIcon className="size-4" />
      </Button>
    </div>
  );
}
