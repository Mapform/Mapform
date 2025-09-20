import type { UIMessage } from "ai";
import { authDataService } from "~/lib/safe-action";
import {
  streamText,
  convertToModelMessages,
  generateText,
  stepCountIs,
  hasToolCall,
  generateId,
} from "ai";
import { NextResponse, after } from "next/server";
import { getCurrentSession } from "~/data/auth/get-current-session";
import { SYSTEM_PROMPT } from "~/lib/ai/prompts";
import { reverseGeocode } from "~/lib/ai/tools/reverse-geocode";
import { findInternalFeatures } from "~/lib/ai/tools/find-internal-features";
import { findExternalFeatures } from "~/lib/ai/tools/find-external-features";
import { returnBestResults } from "~/lib/ai/tools/return-best-results";
import { webSearch } from "~/lib/ai/tools/web-search";
import { createResumableStreamContext } from "resumable-stream";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    messages,
    id,
    projectId,
  }: { messages: UIMessage[]; id: string; projectId?: string } =
    await req.json();

  const session = await getCurrentSession();

  if (!session?.data?.user) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  let chat = await authDataService.getChat({
    id,
  });

  if (!chat?.data) {
    const { text: title } = await generateText({
      model: "gpt-4o-mini",
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
      prompt: JSON.stringify(messages),
    });

    const newChat = await authDataService.createChat({
      id,
      title,
      projectId: projectId ?? null,
    });

    if (!newChat?.data) {
      return NextResponse.json(
        { msg: "Failed to create chat" },
        { status: 500 },
      );
    }

    chat = { data: newChat.data };
  }

  const result = streamText({
    model: "gpt-5-mini",
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: {
      findInternalFeatures,
      reverseGeocode,
      findExternalFeatures,
      returnBestResults,
      webSearch,
    },
    // stopWhen: [stepCountIs(7), hasToolCall("returnBestResults")],
    stopWhen: hasToolCall("returnBestResults"),
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        reasoningSummary: "detailed",
      },
    },
  });

  const response = result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: () => crypto.randomUUID(),
    onFinish: async ({ messages }) => {
      await authDataService.createMessages({
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role,
          parts: m.parts,
        })),
        chatId: id,
      });
      // Clear the active stream when finished
      await authDataService.updateChat({
        id,
        activeStreamId: null,
      });
    },
    async consumeSseStream({ stream }) {
      const streamId = generateId();
      // Create a resumable stream from the SSE stream
      const streamContext = createResumableStreamContext({ waitUntil: after });
      await streamContext.createNewResumableStream(streamId, () => stream);

      // Update the chat with the active stream ID
      await authDataService.updateChat({
        id,
        activeStreamId: streamId,
      });
    },
  });

  return response;
}
