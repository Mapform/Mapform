import type { UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessages({ message }: ChatMessageProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="group/message mx-auto w-full px-4"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {message.parts.map((part, index) => {
          switch (part.type) {
            case "text":
              return <div key={index}>{part.text}</div>;
          }
        })}
      </motion.div>
    </AnimatePresence>
  );
}
