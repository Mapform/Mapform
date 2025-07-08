import { SearchIcon, SendIcon } from "lucide-react";
import { Input } from "@mapform/ui/components/input";
import { cn } from "@mapform/lib/classnames";
import { useChat } from "@ai-sdk/react";
import { useSearch } from "../search";
import { Button } from "@mapform/ui/components/button";
import { useState } from "react";

export function SearchChat() {
  const { chatMode } = useSearch();
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();

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
      <div className="flex-1">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
              }
            })}
          </div>
        ))}
      </div>
      <form
        className="relative flex-shrink-0 border-t p-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <SearchIcon className="text-muted-foreground pointer-events-none absolute left-[18px] top-1/2 size-4 -translate-y-1/2" />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          name="prompt"
          className={cn(
            "bg-muted w-full border-none pl-10 shadow-none !ring-0",
          )}
          placeholder="Ask anything..."
        />
        <Button type="submit" size="icon">
          <SendIcon className="size-4" />
        </Button>
      </form>
    </div>
  );
}
