import type { ChatMessage } from "~/lib/types";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { GlobeIcon, MapPinIcon } from "lucide-react";
import {
  Message as AIMessage,
  MessageContent as AIMessageContent,
} from "@mapform/ui/components/ai-elements/message";
import { Response } from "@mapform/ui/components/ai-elements/response";
import { PickLocationsMessage } from "./pick-locations-message";
import { cn } from "@mapform/lib/classnames";

interface ChatMessageProps {
  message: ChatMessage;
}

export function Message({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

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
        })}
      >
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            return (
              <Response key={`${message.id}-${index}`}>{part.text}</Response>
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
