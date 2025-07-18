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
      {isPending ? (
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
    maxSteps: 5,
    messages: initialMessages ?? [],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      // only send the last message to the server:
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: { message: messages[messages.length - 1], id, projectId: pId },
        };
      },
    }),
    generateId: () => crypto.randomUUID(),
  });

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
          autoFocus
        />
        <Button className="ml-auto" type="submit" size="icon">
          <SendIcon className="size-4" />
        </Button>
      </form>
    </>
  );
}
