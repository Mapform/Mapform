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
  ArrowUpIcon,
  SquareIcon,
  SquarePenIcon,
  XIcon,
  ClockFadingIcon,
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
import Link from "next/link";
import { MapPositioner } from "~/lib/map/map-positioner";
import { Badge } from "@mapform/ui/components/badge";
import { useMap } from "react-map-gl/maplibre";
import { useGeolocation } from "@mapform/lib/hooks/use-geolocation";
import { AddContextDropdown } from "~/components/add-context-dropdown";
import { nullish } from "node_modules/zod/dist/esm/v4/core/util";

interface ChatProps {
  chatWithMessages?: {
    messages?: ChatMessage[];
    chatId: string;
    chatTitle: string;
  };
  usage?: { tokensUsed: number };
}

export function ChatWrapper({ children }: { children: React.ReactNode }) {
  const { params, drawerDepth } = useParamsContext();

  return (
    <MapDrawer
      open={!!params.chatId}
      depth={drawerDepth.get("chatId") ?? 0}
      mobileInitialScrollPosition="top"
      className="pb-0"
    >
      {children}
    </MapDrawer>
  );
}

export function Chat({ chatWithMessages, usage }: ChatProps) {
  const { coords, isLoading: isLoadingGeolocation } = useGeolocation();
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
        title: params.chatOptions?.firstMessage ?? "New Chat",
        projectId: pId ?? null,
      });
    }
    if (params.chatId !== "new" && hasCreatedChatRef.current) {
      hasCreatedChatRef.current = false;
    }
  }, [params.chatId, params.chatOptions?.firstMessage, pId, createChat]);

  if (
    !chatWithMessages ||
    chatWithMessages.chatId !== params.chatId ||
    (params.chatOptions?.userCenter && isLoadingGeolocation)
  )
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
      userCenter={coords}
    />
  );
}

function ChatInner({
  chatWithMessages,
  usage,
  userCenter,
}: ChatProps & { userCenter: { lat: number; lng: number } | null }) {
  const map = useMap();
  const [input, setInput] = useState("");
  const [currentUsage, setCurrentUsage] = useState(usage?.tokensUsed ?? 0);
  const [hasInitiatedNewChat, setHasInitiatedNewChat] = useState(false);
  const { params, setQueryStates, drawerDepth } = useParamsContext();
  const { workspaceSlug, workspaceDirectory } = useWorkspace();

  const mapCenter = {
    lat: map.current?.getCenter().toArray()[1],
    lng: map.current?.getCenter().toArray()[0],
  };

  // Initialize chat with resumable transport.
  // Note: the hook may briefly set status to "submitted" while probing
  // for a resumable stream; UI below avoids flashing during that handshake.
  const { messages, sendMessage, status, stop } = useChat<ChatMessage>({
    id: params.chatId!,
    resume: true,
    experimental_throttle: 50,
    messages: chatWithMessages?.messages ?? [],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: {
            id,
            messages,
            mapCenter: params.chatOptions?.mapCenter ? mapCenter : null,
            userCenter: params.chatOptions?.userCenter ? userCenter : null,
            projects: params.chatOptions?.projects ?? nullish,
          },
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
        params.chatOptions?.firstMessage &&
        !hasInitiatedNewChat &&
        !messages.length &&
        params.chatId
      ) {
        setHasInitiatedNewChat(true);
        await sendMessage({
          id: params.chatId,
          parts: [{ type: "text", text: params.chatOptions.firstMessage }],
        });
      }
    })();
  }, [
    params.chatOptions?.firstMessage,
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
    <MapPositioner disabled={drawerDepth.get("chatId") !== 0}>
      <MapDrawerToolbar className="flex max-w-full overflow-hidden">
        <div className="mr-2 flex flex-1 truncate">
          <Badge className="max-w-full truncate" variant="secondary">
            {chatWithMessages?.chatTitle ?? "New Chat"}
          </Badge>
        </div>
        <Button
          className="ml-auto"
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={() => {
            void setQueryStates({
              chatId: "new",
              chatOptions: {
                ...params.chatOptions,
                firstMessage: null,
              },
            });
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
        <ConversationContent
          className="px-6 pb-6"
          mobileAutoScrollKey={messages.length}
        >
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
            <AlertIcon icon={ClockFadingIcon} />
            <AlertDescription>
              You have reached your daily token limit. To increase your limit
              please <Link href="mailto:support@mapform.co">reach out</Link>.
            </AlertDescription>
          </Alert>
        )}

        <form
          className={cn(
            "relative flex flex-shrink-0 flex-col gap-2 border-t p-3 pl-4",
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
          <div className="flex">
            <AddContextDropdown />
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
                    size="icon-sm"
                    disabled={!input || hasReachedTokenLimit}
                  >
                    <ArrowUpIcon className="size-4" />
                  </Button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </form>
      </div>
    </MapPositioner>
  );
}
