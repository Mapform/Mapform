"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { cn } from "@mapform/lib/classnames";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { Button } from "@mapform/ui/components/button";
import { BrainIcon, Loader2, SendIcon, XIcon } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "~/lib/types";
import { Message } from "./message";
import { DefaultChatTransport } from "ai";
import { useParams } from "next/navigation";
import { LoadingSkeleton } from "~/components/loading-skeleton";

interface ChatProps {
  initialMessages?: ChatMessage[];
}

export function Chat({ initialMessages }: ChatProps) {
  const { params, drawerDepth, isPending } = useParamsContext();

  return (
    <MapDrawer open={!!params.chatId} depth={drawerDepth.get("chatId") ?? 0}>
      {isPending && !initialMessages ? (
        <LoadingSkeleton />
      ) : (
        <ChatInner initialMessages={initialMessages} />
      )}
    </MapDrawer>
  );
}

function ChatInner({ initialMessages }: ChatProps) {
  const [input, setInput] = useState("");
  const [hasInitiatedNewChat, setHasInitiatedNewChat] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { pId } = useParams();
  const { params, setQueryStates } = useParamsContext();

  const { messages, sendMessage, status } = useChat<ChatMessage>({
    id: params.chatId!,
    messages: initialMessages ?? [],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: { messages, id, projectId: pId },
        };
      },
    }),
    generateId: () => crypto.randomUUID(),
  });

  const handleSubmit = () => {
    void sendMessage({ text: input });
    setInput("");
  };

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior,
    });
  };

  useEffect(() => {
    if (status === "submitted") {
      // Scroll to bottom of chat smoothly after sending a message
      scrollToBottom("smooth");
    }
  }, [status]);

  // Scroll to bottom on page load
  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  useEffect(() => {
    if (
      params.query &&
      !hasInitiatedNewChat &&
      params.chatId &&
      !messages.length
    ) {
      setHasInitiatedNewChat(true);
      void sendMessage({
        id: params.chatId,
        parts: [{ type: "text", text: params.query }],
      });
    }
  }, [params.query, sendMessage, hasInitiatedNewChat, params.chatId, messages]);

  return (
    <>
      <MapDrawerToolbar>
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
      </MapDrawerToolbar>
      <div
        ref={chatContainerRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-96"
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {status === "submitted" &&
          messages.length > 0 &&
          messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-center">
              <Loader2 className="size-4 animate-spin" />
            </div>
          )}

        {messages.some((m) =>
          m.parts.some(
            (p) => p.type === "reasoning" && p.state === "streaming",
          ),
        ) && (
          <div className="flex animate-pulse items-center text-sm">
            <BrainIcon className="mr-2 size-4" /> Thinking...
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
          autoFocus
        />
        <Button className="ml-auto" type="submit" size="icon">
          <SendIcon className="size-4" />
        </Button>
      </form>
    </>
  );
}
