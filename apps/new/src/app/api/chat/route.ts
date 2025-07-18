import { openai } from "@ai-sdk/openai";
import type { UIMessage } from "ai";
import { authClient } from "~/lib/safe-action";
import { streamText, convertToModelMessages, generateText } from "ai";
import { NextResponse } from "next/server";
import { getCurrentSession } from "~/data/auth/get-current-session";
import { SYSTEM_PROMPT } from "~/lib/ai/prompts";
import { autocomplete } from "~/lib/ai/tools/autocomplete";
import { getInformation } from "~/lib/ai/tools/get-information";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    message,
    id,
    projectId,
  }: { message: UIMessage; id: string; projectId?: string } = await req.json();

  const session = await getCurrentSession();

  if (!session?.data?.user) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  let chat = await authClient.getChat({
    id,
  });

  if (!chat?.data) {
    const { text: title } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
      prompt: JSON.stringify(message),
    });

    const newChat = await authClient.createChat({
      id,
      title,
      projectId: projectId ?? null,
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
    generateMessageId: () => crypto.randomUUID(),
    onFinish: async ({ messages }) => {
      await authClient.createMessages({
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role,
          parts: m.parts,
        })),
        chatId: id,
      });
    },
  });

  return response;
}
