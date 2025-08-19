"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { cn } from "@mapform/lib/classnames";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { Button } from "@mapform/ui/components/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@mapform/ui/components/ai-elements/conversation";
import {
  Loader2,
  SendIcon,
  SquareIcon,
  SquarePenIcon,
  XIcon,
} from "lucide-react";

import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import type { ChatMessage } from "~/lib/types";
import { Message } from "./message";
import { DefaultChatTransport } from "ai";
import { useParams } from "next/navigation";
import { BasicSkeleton } from "~/components/skeletons/basic";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
} from "@mapform/ui/components/ai-elements/prompt-input";

interface ChatProps {
  initialMessages?: ChatMessage[];
}

export function Chat({ initialMessages }: ChatProps) {
  const { params, drawerDepth, isPending, setQueryStates } = useParamsContext();

  return (
    <MapDrawer open={!!params.chatId} depth={drawerDepth.get("chatId") ?? 0}>
      {isPending ? (
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
          <BasicSkeleton className="p-6" />
        </>
      ) : (
        <ChatInner key={params.chatId} initialMessages={initialMessages} />
      )}
    </MapDrawer>
  );
}

function ChatInner({ initialMessages }: ChatProps) {
  const [input, setInput] = useState("");
  const [hasInitiatedNewChat, setHasInitiatedNewChat] = useState(false);
  const { pId } = useParams();
  const { params, setQueryStates } = useParamsContext();

  const { messages, sendMessage, status, stop, error } = useChat<ChatMessage>({
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
    if (status === "streaming" || status === "submitted" || !input) {
      return;
    }

    void sendMessage({ text: input });
    setInput("");
  };

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

  console.log(messages);
  console.log(status, error);

  return (
    <>
      <MapDrawerToolbar>
        <Button
          className="ml-auto"
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={async () => {
            const randomId = crypto.randomUUID();
            await setQueryStates({ chatId: randomId, query: null });
          }}
        >
          <SquarePenIcon className="size-4" />
        </Button>
        <Button
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
      <Conversation>
        <ConversationContent className="px-6 pb-6">
          {/* <div
        ref={chatContainerRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-96"
      > */}
          {messages.map((message) => (
            <Message key={message.id} message={message} status={status} />
          ))}
          {status === "submitted" && (
            <div className="flex items-center">
              <Loader2 className="size-4 animate-spin" />
            </div>
          )}
          {status === "error" && (
            <div className="flex animate-pulse items-center text-sm">Error</div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={
              status === "streaming" || status === "submitted" ? "stop" : "send"
            }
            className="ml-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            {status === "streaming" || status === "submitted" ? (
              <Button type="button" size="icon" onClick={stop}>
                <SquareIcon className="size-4" fill="currentColor" />
              </Button>
            ) : (
              <Button
                className="ml-auto"
                type="submit"
                size="icon"
                disabled={!input}
              >
                <SendIcon className="size-4" />
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </form>
    </>
  );
}
