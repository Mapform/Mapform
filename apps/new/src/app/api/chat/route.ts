import { openai } from "@ai-sdk/openai";
import type { UIMessage } from "ai";
import { authClient } from "~/lib/safe-action";
import { streamText, convertToModelMessages } from "ai";
import { NextResponse } from "next/server";
import { getCurrentSession } from "~/data/auth/get-current-session";
import { SYSTEM_PROMPT } from "~/lib/ai/prompts";
import { autocomplete } from "~/lib/ai/tools/autocomplete";
import { getInformation } from "~/lib/ai/tools/get-information";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { message, id }: { message: UIMessage; id: string } = await req.json();

  const session = await getCurrentSession();

  if (!session?.data?.user) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  let chat = await authClient.getChat({
    id,
  });

  if (!chat?.data) {
    const newChat = await authClient.createChat({
      id,
      title: "New Chat",
      projectId: null,
    });

    console.log("newChat", newChat?.validationErrors);

    if (!newChat?.data) {
      return NextResponse.json(
        { msg: "Failed to create chat" },
        { status: 500 },
      );
    }

    chat = { data: newChat.data };
  }

  const previousMessages =
    (
      await authClient.getMessages({
        chatId: id,
      })
    )?.data ?? [];

  const messages = [...previousMessages, message] as UIMessage[];

  const result = streamText({
    model: openai("gpt-4o"),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: {
      autocomplete,
      getInformation,
    },
  });

  const response = result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages }) => {
      console.log("create messages", messages);
      await authClient.createMessages({
        messages,
        chatId: id,
      });

      console.log("finished");
    },
  });

  return response;
}
