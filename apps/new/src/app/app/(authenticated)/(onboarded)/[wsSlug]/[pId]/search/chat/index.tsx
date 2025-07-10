import { Loader2, SendIcon, XIcon } from "lucide-react";
import { cn } from "@mapform/lib/classnames";
import { useChat } from "@ai-sdk/react";
import { useSearch } from "../../search";
import { Button } from "@mapform/ui/components/button";
import { useEffect, useRef, useState } from "react";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { MapDrawerActions } from "~/components/map-drawer";
import type { ChatMessage } from "~/lib/types";
import { Message } from "./message";

export function SearchChat() {
  const { chatMode, setChatMode } = useSearch();
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat<ChatMessage>({
    maxSteps: 5,
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    void sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    if (!chatContainerRef.current) return;

    if (status === "submitted") {
      // Scroll to bottom of chat smoothly after sending a message using a ref
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [status]);

  return (
    <div
      className={cn(
        "absolute inset-0 z-30 flex flex-col rounded-lg transition-all duration-300",
        {
          "pointer-events-auto visible bg-white/80 opacity-100 backdrop-blur-sm":
            chatMode,
          "pointer-events-none invisible bg-white/0 opacity-0 backdrop-blur-none":
            !chatMode,
        },
      )}
    >
      <div
        ref={chatContainerRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-6 pb-96"
      >
        <MapDrawerActions>
          <Button
            className="absolute right-2 top-2 z-30"
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => {
              setChatMode(false);
            }}
          >
            <XIcon className="size-4" />
          </Button>
        </MapDrawerActions>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {status === "submitted" && (
          <div className="flex items-center">
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
      </div>
      <form
        className="relative flex flex-shrink-0 flex-col gap-2 border-t p-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <AutoSizeTextArea
          value={input}
          onChange={(value) => setInput(value)}
          onEnter={handleSubmit}
          className={cn(
            "bg-muted w-full border-none pl-10 shadow-none !ring-0",
          )}
          placeholder="Ask anything..."
        />
        <Button className="ml-auto" type="submit" size="icon">
          <SendIcon className="size-4" />
        </Button>
      </form>
    </div>
  );
}
