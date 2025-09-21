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
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import { createChatAction } from "~/data/chats/create-chat";

interface ChatProps {
  chatWithMessages?: { messages?: ChatMessage[]; chatId: string };
}

export function Chat({ chatWithMessages }: ChatProps) {
  const { pId } = useParams<{ pId?: string }>();
  const { params, drawerDepth, isPending, setQueryStates } = useParamsContext();
  const { execute: createChat, isPending: isCreatingChat } = useAction(
    createChatAction,
    {
      onSuccess: ({ data }) => {
        void setQueryStates({ chatId: data?.id });
      },
      onError: ({ error }) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.serverError,
        });
      },
    },
  );

  /**
   * Used to start a new chat
   */
  useEffect(() => {
    if (isPending) return;
    if (params.chatId === "new") {
      createChat({
        title: params.query ?? "New Chat",
        projectId: pId ?? null,
      });
    }
  }, [
    chatWithMessages,
    setQueryStates,
    createChat,
    pId,
    params.chatId,
    params.query,
    isPending,
  ]);

  return (
    <MapDrawer open={!!params.chatId} depth={drawerDepth.get("chatId") ?? 0}>
      {params.chatId === "new" ||
      isCreatingChat ||
      (isPending && chatWithMessages?.chatId !== params.chatId) ? (
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
        <ChatInner key={params.chatId} chatWithMessages={chatWithMessages} />
      )}
    </MapDrawer>
  );
}

function ChatInner({ chatWithMessages }: ChatProps) {
  const [input, setInput] = useState("");
  const [hasInitiatedNewChat, setHasInitiatedNewChat] = useState(false);
  const { params, setQueryStates } = useParamsContext();

  const { messages, sendMessage, status, stop } = useChat<ChatMessage>({
    id: params.chatId!,
    resume: true,
    messages: chatWithMessages?.messages ?? [],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: { messages, id },
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
    void (async () => {
      if (
        params.query &&
        !hasInitiatedNewChat &&
        !messages.length &&
        params.chatId
      ) {
        setHasInitiatedNewChat(true);
        await sendMessage({
          id: params.chatId,
          parts: [{ type: "text", text: params.query }],
        });
      }
    })();
  }, [
    params.query,
    sendMessage,
    hasInitiatedNewChat,
    params.chatId,
    messages,
    setQueryStates,
  ]);

  // Derive UI behavior without extra state.
  const lastMessage = messages[messages.length - 1];
  const isUserAwaitingResponse = lastMessage?.role === "user";
  const showSubmittingIndicator =
    status === "submitted" && isUserAwaitingResponse;
  const showStop =
    status === "streaming" ||
    (status === "submitted" && isUserAwaitingResponse);

  return (
    <>
      <MapDrawerToolbar>
        <Button
          className="ml-auto"
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={() => {
            void setQueryStates({ chatId: "new", query: null });
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
          {messages.map((message) => (
            <Message key={message.id} message={message} status={status} />
          ))}
          {showSubmittingIndicator && (
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
            key={showStop ? "stop" : "send"}
            className="ml-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            {showStop ? (
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
