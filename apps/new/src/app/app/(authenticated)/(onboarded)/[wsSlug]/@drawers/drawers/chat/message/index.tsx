import type { ChatMessage } from "~/lib/types";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@mapform/lib/classnames";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { AutocompleteMessage } from "./autocomplete-message";
import { Markdown } from "~/components/markdown";
import { ReverseGeocodeMessage } from "./reverse-geocode-message";

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
          className={cn("w-full text-sm", {
            "max-w-[80%] rounded-lg bg-gray-900 px-3 py-1.5": isUser,
          })}
        >
          {message.parts.map((part, index) => {
            if (part.type === "reasoning") {
            }

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

            if (part.type === "tool-autocomplete") {
              if (part.state === "input-available") {
                return (
                  <Skeleton className="h-4 w-full" key={part.toolCallId} />
                );
              }

              if (part.state === "output-available") {
                return (
                  <AutocompleteMessage
                    key={part.toolCallId}
                    result={part.output}
                  />
                );
              }
            }

            if (part.type === "tool-reverseGeocode") {
              if (part.state === "input-available") {
                return (
                  <Skeleton className="h-4 w-full" key={part.toolCallId} />
                );
              }

              if (part.state === "output-available") {
                return (
                  <ReverseGeocodeMessage
                    key={part.toolCallId}
                    result={part.output}
                  />
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
