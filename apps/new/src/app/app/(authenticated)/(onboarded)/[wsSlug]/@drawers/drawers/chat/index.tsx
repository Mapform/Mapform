"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { cn } from "@mapform/lib/classnames";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { Button } from "@mapform/ui/components/button";
import { Loader2, SendIcon, XIcon } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "~/lib/types";
import { Message } from "./message";

export function Chat() {
  const { params } = useParamsContext();

  return (
    <MapDrawer open={!!params.chatId} depth={0}>
      <ChatInner />
    </MapDrawer>
  );
}

function ChatInner() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat<ChatMessage>({
    maxSteps: 5,
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { params, setQueryStates } = useParamsContext();

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
    <>
      <MapDrawerToolbar>
        <div className="flex items-center gap-2">
          <Button
            className="ml-auto"
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={() => {
              void setQueryStates({ chatId: null });
            }}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </MapDrawerToolbar>
      <div
        ref={chatContainerRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-96"
      >
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
    </>
  );
}
