import type { ChatMessage } from "~/lib/types";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@mapform/lib/classnames";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { AutocompleteMessage } from "./autocomplete-message";
import { Markdown } from "~/components/markdown";
import { ReverseGeocodeMessage } from "./reverse-geocode-message";
import { GlobeIcon } from "lucide-react";
import { GetInformationMessage } from "./get-information-message";

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

            if (part.type === "tool-autocomplete") {
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
                  <AutocompleteMessage
                    key={part.toolCallId}
                    result={part.output!}
                  />
                );
              }
            }

            if (part.type === "tool-getInformation") {
              if (part.state === "input-available") {
                return (
                  <Skeleton
                    className="h-16 w-full border"
                    key={part.toolCallId}
                  />
                );
              }

              if (part.state === "output-available") {
                return (
                  <GetInformationMessage
                    key={part.toolCallId}
                    result={part.output}
                  />
                );
              }
            }

            if (part.type === "tool-webSearch") {
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

            if (part.type === "tool-reverseGeocode") {
              if (part.state === "input-available") {
                return (
                  <Skeleton
                    className="h-16 w-full border"
                    key={part.toolCallId}
                  />
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

              if (part.state === "output-error") {
                return (
                  <div key={index} className="prose-sm whitespace-pre-wrap">
                    <Markdown>{`${part.errorText}.`}</Markdown>
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
