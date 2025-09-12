import type { ChatMessage } from "~/lib/types";
import { Skeleton } from "@mapform/ui/components/skeleton";
import type { LucideIcon } from "lucide-react";
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
import type { ToolUIPart } from "ai";
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
                <>
                  <Response className="my-4">
                    {part.output.description}
                  </Response>
                  <PickLocationsMessage
                    key={part.toolCallId}
                    results={part.output.results}
                  />
                </>
              );
            }

            return (
              <Response key={`${message.id}-${index}`}>
                {`${part.errorText}.`}
              </Response>
            );
          }

          if (
            part.type === "tool-findExternalFeatures" ||
            part.type === "tool-findInternalFeatures" ||
            part.type === "tool-reverseGeocode"
          ) {
            return (
              <ToolMessage
                key={`${message.id}-${index}`}
                part={part}
                icon={MapPinIcon}
                streamingText="Mapping locations..."
                doneText="Location found"
                errorText="Location not found"
              />
            );
          }

          if (part.type === "tool-webSearch") {
            return (
              <ToolMessage
                key={`${message.id}-${index}`}
                part={part}
                icon={GlobeIcon}
                streamingText="Searching the web..."
                doneText="Web search complete"
                errorText="Web search failed"
              />
            );
          }

          return null;
        })}
      </AIMessageContent>
    </AIMessage>
  );
}

function ToolMessage({
  part,
  icon,
  streamingText,
  doneText,
  errorText,
}: {
  part: ToolUIPart;
  icon: LucideIcon;
  streamingText: string;
  doneText: string;
  errorText: string;
}) {
  const Icon = icon;
  return (
    <div className="text-muted-foreground mb-4 flex w-full items-center gap-2 text-sm">
      <div className="flex items-center gap-2">
        <Icon className="size-4" />
      </div>
      <p className="my-0">
        {part.state === "input-streaming" || part.state === "input-available"
          ? streamingText
          : part.state === "output-available"
            ? doneText
            : errorText}
      </p>
    </div>
  );
}
