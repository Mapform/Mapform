import { SendIcon } from "lucide-react";
import { cn } from "@mapform/lib/classnames";
import { useChat } from "@ai-sdk/react";
import { useSearch } from "../../search";
import { Button } from "@mapform/ui/components/button";
import { useState } from "react";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { ChatMessages } from "./messages";

export function SearchChat() {
  const { chatMode } = useSearch();
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat({
    maxSteps: 5,
  });

  const handleSubmit = () => {
    void sendMessage({ text: input });
    setInput("");
  };

  return (
    <div
      className={cn(
        "absolute inset-0 z-30 flex flex-col rounded-lg transition-all duration-300",
        {
          "pointer-events-auto visible bg-white/80 opacity-100 backdrop-blur-sm":
            chatMode,
          "pointer-events-none invisible bg-white/0 opacity-0 backdrop-blur-none":
            !chatMode,
        },
      )}
    >
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessages key={message.id} message={message} />
        ))}
      </div>
      <form
        className="relative flex flex-shrink-0 flex-col gap-2 border-t p-4"
        onSubmit={handleSubmit}
      >
        <AutoSizeTextArea
          value={input}
          onChange={(value) => setInput(value)}
          onEnter={handleSubmit}
          className={cn(
            "bg-muted w-full border-none pl-10 shadow-none !ring-0",
          )}
          placeholder="Ask anything..."
        />
        <Button className="ml-auto" type="submit" size="icon">
          <SendIcon className="size-4" />
        </Button>
      </form>
    </div>
  );
}
