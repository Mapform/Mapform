import type { ChatMessage } from "~/lib/types";
import { Skeleton } from "@mapform/ui/components/skeleton";
import {
  BrainIcon,
  ChevronDownIcon,
  GlobeIcon,
  MapPinIcon,
} from "lucide-react";
import {
  Message as AIMessage,
  MessageContent as AIMessageContent,
} from "@mapform/ui/components/ai-elements/message";
import { Response } from "@mapform/ui/components/ai-elements/response";
import { PickLocationsMessage } from "./pick-locations-message";
import { cn } from "@mapform/lib/classnames";
import { type ChatStatus } from "ai";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@mapform/ui/components/collapsible";

interface ChatMessageProps {
  message: ChatMessage;
  status: ChatStatus;
}

export function Message({ message }: ChatMessageProps) {
  return (
    <AIMessage
      className={cn({
        "w-full max-w-full [&>div]:max-w-[100%]": message.role !== "user",
      })}
      from={message.role}
    >
      <AIMessageContent
        className={cn({
          "w-full max-w-full !bg-transparent p-0": message.role !== "user",
          "py-2.5": message.role === "user",
        })}
      >
        {message.parts.map((part, index) => {
          /**
           * TEXT MESSAGES
           */
          if (part.type === "text") {
            return (
              <Response key={`${message.id}-${index}`}>{part.text}</Response>
            );
          }

          if (part.type === "reasoning") {
            const expandable = part.state === "done" && part.text.length > 0;

            return (
              <Collapsible
                className="transition-all duration-200 [&[data-state=closed]>button>svg]:-rotate-90"
                disabled={!expandable}
                key={`${message.id}-${index}`}
              >
                <CollapsibleTrigger className="text-muted-foreground mb-4 flex w-full items-center gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BrainIcon className="size-4" />
                  </div>
                  <p className="my-0">
                    {part.state === "streaming" ? "Thinking..." : "Thought"}
                  </p>
                  {expandable && (
                    <ChevronDownIcon className="ml-auto size-4 transition-transform" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-3 border-l-2">
                  <p className="text-muted-foreground mt-0 pl-4">{part.text}</p>
                </CollapsibleContent>
              </Collapsible>
            );
          }

          if (part.type === "tool-returnBestResults") {
            if (
              part.state === "input-available" ||
              part.state === "input-streaming"
            ) {
              return (
                <Skeleton
                  className="h-16 w-full border"
                  key={part.toolCallId}
                />
              );
            }

            if (part.state === "output-available") {
              return (
                <PickLocationsMessage
                  key={part.toolCallId}
                  results={part.output}
                />
              );
            }

            return (
              <Response key={`${message.id}-${index}`}>
                {`${part.errorText}.`}
              </Response>
            );
          }

          if (
            part.type === "tool-autocomplete" ||
            part.type === "tool-getInformation" ||
            part.type === "tool-reverseGeocode"
          ) {
            if (part.state === "input-streaming") {
              return (
                <div
                  className="flex animate-pulse items-center gap-2"
                  key={part.toolCallId}
                >
                  <MapPinIcon className="size-4 animate-pulse" />
                  <span className="text-sm">Mapping locations...</span>
                </div>
              );
            }
          }

          if (part.type === "tool-web_search_preview") {
            if (
              part.state === "input-available" ||
              part.state === "input-streaming"
            ) {
              return (
                <div
                  className="flex animate-pulse items-center gap-2"
                  key={part.toolCallId}
                >
                  <GlobeIcon className="mr-2 size-4" />
                  <span className="text-sm">Searching the web...</span>
                </div>
              );
            }
          }

          return null;
        })}
      </AIMessageContent>
    </AIMessage>
  );
}
