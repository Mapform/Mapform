import type { ChatMessage } from "~/lib/types";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@mapform/lib/classnames";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { Markdown } from "~/components/markdown";
import { GlobeIcon, MapPinIcon } from "lucide-react";
import { PickLocationsMessage } from "./pick-locations-message";

interface ChatMessageProps {
  message: ChatMessage;
}

export function Message({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "min- flex w-full",
          isUser ? "justify-end" : "justify-start",
        )}
      >
        <div
          className={cn("flex w-full flex-col gap-2 text-sm", {
            "max-w-[80%] rounded-lg bg-gray-900 px-3 py-1.5": isUser,
          })}
        >
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return (
                <div
                  key={index}
                  className={cn("prose-sm whitespace-pre-wrap", {
                    "text-white": isUser,
                  })}
                >
                  <Markdown>{part.text}</Markdown>
                </div>
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
                <div key={index} className="prose-sm whitespace-pre-wrap">
                  <Markdown>{`${part.errorText}.`}</Markdown>
                </div>
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

            console.debug("UNHANDLED MESSAGE PART", part);

            return null;
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
