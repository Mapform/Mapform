import type { UIMessage } from "ai";
import { authDataService } from "~/lib/safe-action";
import {
  streamText,
  convertToModelMessages,
  hasToolCall,
  generateId,
  generateText,
} from "ai";
import { NextResponse, after } from "next/server";
import { headers as getHeaders } from "next/headers";
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
  const { messages, id } = (await req.json()) as {
    messages: UIMessage[];
    id: string;
  };

  const session = await getCurrentSession();

  if (!session?.data?.user) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const headersList = await getHeaders();
  const workspaceSlug = headersList.get("x-workspace-slug");

  if (!workspaceSlug) {
    return NextResponse.json(
      { msg: "Workspace slug is required" },
      { status: 400 },
    );
  }

  // Enforce token limit before generating
  try {
    const directory = await authDataService.getWorkspaceDirectory({
      slug: workspaceSlug,
    });
    const plan = directory?.data?.plan;

    if (plan?.dailyAiTokenLimit) {
      const usage = await authDataService.getAiTokenUsage({ workspaceSlug });
      const used = usage?.data?.tokensUsed ?? 0;

      if (used >= plan.dailyAiTokenLimit) {
        return NextResponse.json(
          {
            msg: "Daily AI token limit reached. Upgrade your plan or try again tomorrow.",
          },
          { status: 429 },
        );
      }
    }
  } catch (e) {
    console.warn("Failed to check AI token limits", e);
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
    onFinish: async ({ usage }) => {
      const totalTokens = usage.totalTokens;

      if (workspaceSlug && totalTokens && totalTokens > 0) {
        await authDataService.incrementAiTokenUsage({
          workspaceSlug,
          tokens: totalTokens,
        });
      }
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

      const userMessages = messages.filter((m) => m.role === "user");
      const firstUserMessage = userMessages[0];
      let title = null;

      if (firstUserMessage && userMessages.length === 1) {
        const result = await generateText({
          model: "gpt-4o-mini",
          system: `\n
          - you will generate a short title based on the first message a user begins a conversation with
          - ensure it is not more than 80 characters long
          - the title should be a summary of the user's message
          - do not use quotes or colons`,
          prompt: JSON.stringify(firstUserMessage),
        });

        title = result.text;
      }

      // Clear the active stream when finished
      await authDataService.updateChat({
        id,
        activeStreamId: null,
        ...(title ? { title } : {}),
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

      // No token metrics available in this callback across all providers
    },
  });

  return response;
}
