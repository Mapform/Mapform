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
                <CollapsibleContent className="ml-2 border-l">
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
            return (
              <div
                key={`${message.id}-${index}`}
                className="text-muted-foreground mb-4 flex w-full items-center gap-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4" />
                </div>
                <p className="my-0">
                  {part.state === "input-streaming" ||
                  part.state === "input-available"
                    ? "Mapping locations..."
                    : part.state === "output-available"
                      ? "Location found"
                      : "Location not found"}
                </p>
              </div>
            );
          }

          if (part.type === "tool-webSearch") {
            <div
              key={`${message.id}-${index}`}
              className="text-muted-foreground mb-4 flex w-full items-center gap-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <GlobeIcon className="size-4" />
              </div>
              <p className="my-0">
                {part.state === "input-streaming" ||
                part.state === "input-available"
                  ? "Searching the web..."
                  : part.state === "output-available"
                    ? "Web search complete"
                    : "Web search failed"}
              </p>
            </div>;
          }

          return null;
        })}
      </AIMessageContent>
    </AIMessage>
  );
}
