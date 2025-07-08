import type { UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@mapform/lib/classnames";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessages({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
      >
        <div
          className={cn("text-sm", {
            "max-w-[80%] rounded-lg bg-gray-900 px-3 py-1.5 text-white": isUser,
          })}
        >
          {message.parts.map((part, index) => {
            switch (part.type) {
              case "text":
                return (
                  <div key={index} className="whitespace-pre-wrap">
                    {part.text}
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
