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
  AlertCircleIcon,
  XIcon,
} from "lucide-react";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
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
import { useWorkspace } from "../../../workspace-context";
import {
  Alert,
  AlertDescription,
  AlertIcon,
} from "@mapform/ui/components/alert";

interface ChatProps {
  chatWithMessages?: { messages?: ChatMessage[]; chatId: string };
  usage?: { tokensUsed: number };
}

export function ChatWrapper({ children }: { children: React.ReactNode }) {
  const { params, drawerDepth } = useParamsContext();

  return (
    <MapDrawer open={!!params.chatId} depth={drawerDepth.get("chatId") ?? 0}>
      {children}
    </MapDrawer>
  );
}

export function Chat({ chatWithMessages, usage }: ChatProps) {
  const { pId } = useParams<{ pId?: string }>();
  const { params, setQueryStates } = useParamsContext();
  const { execute: createChat } = useAction(createChatAction, {
    onSuccess: ({ data }) => {
      void setQueryStates({ chatId: data?.id });
    },
    onError: ({ error }) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.serverError,
      });
    },
  });

  /**
   * Used to start a new chat
   */
  const hasCreatedChatRef = useRef(false);
  useEffect(() => {
    if (params.chatId === "new" && !hasCreatedChatRef.current) {
      hasCreatedChatRef.current = true;
      createChat({
        title: params.query ?? "New Chat",
        projectId: pId ?? null,
      });
    }
    if (params.chatId !== "new" && hasCreatedChatRef.current) {
      hasCreatedChatRef.current = false;
    }
  }, [params.chatId, params.query, pId, createChat]);

  if (!chatWithMessages || chatWithMessages.chatId !== params.chatId)
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
        <BasicSkeleton className="p-6" />
      </>
    );

  return (
    <ChatInner
      usage={usage}
      key={params.chatId}
      chatWithMessages={chatWithMessages}
    />
  );
}

function ChatInner({ chatWithMessages, usage }: ChatProps) {
  const [input, setInput] = useState("");
  const [currentUsage, setCurrentUsage] = useState(usage?.tokensUsed ?? 0);
  const [hasInitiatedNewChat, setHasInitiatedNewChat] = useState(false);
  const { params, setQueryStates } = useParamsContext();
  const { workspaceSlug, workspaceDirectory } = useWorkspace();

  // Initialize chat with resumable transport.
  // Note: the hook may briefly set status to "submitted" while probing
  // for a resumable stream; UI below avoids flashing during that handshake.
  const { messages, sendMessage, status, stop, error } = useChat<ChatMessage>({
    id: params.chatId!,
    resume: true,
    messages: chatWithMessages?.messages ?? [],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: { messages, id },
          headers: { "x-workspace-slug": workspaceSlug },
        };
      },
    }),
    generateId: () => crypto.randomUUID(),
    onData: (data) => {
      if (data.type === "data-ai-token-usage") {
        setCurrentUsage((data.data as { tokens: number }).tokens);
      }
    },
  });

  console.log("ERROR", error);

  const handleSubmit = () => {
    if (status === "streaming" || status === "submitted" || !input) {
      return;
    }

    void sendMessage({ text: input });
    setInput("");
  };

  // Auto-seed a new chat once from the query, if present.
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

  // - showSubmittingIndicator: only when the last message was by the user
  //   to suppress the initial "submitted" during resume handshake.
  // - showStop: when streaming, or submitted while awaiting a response.
  const lastMessage = messages[messages.length - 1];
  const isUserAwaitingResponse = lastMessage?.role === "user";
  const showSubmittingIndicator =
    status === "submitted" && isUserAwaitingResponse;
  const showStop =
    status === "streaming" ||
    (status === "submitted" && isUserAwaitingResponse);

  const tokenLimit = workspaceDirectory.plan?.dailyAiTokenLimit;
  const hasReachedTokenLimit = Boolean(
    tokenLimit && currentUsage >= tokenLimit,
  );

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
            <div className="flex items-center text-sm">Error</div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="bg-background flex flex-shrink-0 flex-col max-md:sticky max-md:bottom-0">
        {hasReachedTokenLimit && (
          <Alert className="rounded-none border-t">
            <AlertIcon icon={AlertCircleIcon} />
            <AlertDescription>
              You have reached your daily token limit.
            </AlertDescription>
          </Alert>
        )}

        <form
          className={cn(
            "relative flex flex-shrink-0 flex-col gap-2 border-t p-4",
            hasReachedTokenLimit && "opacity-50",
          )}
          onSubmit={(e) => {
            if (hasReachedTokenLimit) {
              return;
            }

            e.preventDefault();
            handleSubmit();
          }}
        >
          <AutoSizeTextArea
            value={input}
            onChange={(value) => setInput(value)}
            onEnter={handleSubmit}
            disabled={hasReachedTokenLimit}
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
                  disabled={!input || hasReachedTokenLimit}
                >
                  <SendIcon className="size-4" />
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </>
  );
}
