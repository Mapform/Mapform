import { notEmpty } from "@mapform/lib/not-empty";
import { geolocation } from "@vercel/functions";
import type { UIMessage } from "ai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  generateText,
  hasToolCall,
  streamText,
} from "ai";
import { headers as getHeaders } from "next/headers";
import { after, NextResponse } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { getCurrentSession } from "~/data/auth/get-current-session";
import { getSystemPrompt } from "~/lib/ai/prompts";
import { findRawExternalFeatures } from "~/lib/ai/tools/find-external-features";
import { findRawInternalFeatures } from "~/lib/ai/tools/find-internal-features";
import { returnBestResults } from "~/lib/ai/tools/return-best-results";
import { reverseGeocode } from "~/lib/ai/tools/reverse-geocode";
import { webSearch } from "~/lib/ai/tools/web-search";
import { authDataService } from "~/lib/safe-action";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, id, mapCenter, userCenter, projects } =
      (await req.json()) as {
        id: string;
        messages: UIMessage[];
        mapCenter?: { lat: number; lng: number } | null;
        userCenter?: { lat: number; lng: number } | null;
        projects?: string[] | null;
      };

    const session = await getCurrentSession();

    if (!session?.data?.user) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const headersList = await getHeaders();
    const workspaceSlug = headersList.get("x-workspace-slug");
    const ipLocation = geolocation(req);

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
      console.error("Failed to check AI token limits", e);
    }

    const projectsData = await Promise.all(
      projects?.map((project) =>
        authDataService.getProject({ projectId: project }),
      ) ?? [],
    );

    const refinedProjects = projectsData
      .map((project) => project?.data)
      .filter(notEmpty);

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        // As per: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence#option-2-setting-ids-with-createuimessagestream
        writer.write({
          type: "start",
          messageId: crypto.randomUUID(), // Generate server-side ID for persistence
        });

        const result = streamText({
          model: "gpt-5-mini",
          system: getSystemPrompt(
            mapCenter,
            userCenter,
            ipLocation,
            refinedProjects,
          ),
          messages: convertToModelMessages(messages),
          tools: {
            findRawInternalFeatures,
            // TODO: Disable for now since reverse-geocoding is being disabled
            reverseGeocode,
            findRawExternalFeatures,
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
            try {
              const totalTokens = usage.totalTokens;

              if (workspaceSlug && totalTokens && totalTokens > 0) {
                const result = await authDataService.incrementAiTokenUsage({
                  workspaceSlug,
                  tokens: totalTokens,
                });

                if (result?.data?.tokensUsed) {
                  writer.write({
                    type: "data-ai-token-usage",
                    data: { tokens: result.data.tokensUsed },
                  });
                }
              }
            } catch (e) {
              console.error("Failed to increment AI token usage", e);
            }
          },
          onError: (error) => {
            console.error("Stream text error:", error);
          },
        });

        writer.merge(result.toUIMessageStream({ sendStart: false }));
      },
      originalMessages: messages,
      onFinish: async ({ messages }) => {
        try {
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
        } catch (e) {
          console.error("Failed to finalize chat", e);
        }
      },
    });

    return createUIMessageStreamResponse({
      stream,
      consumeSseStream: async ({ stream }) => {
        try {
          const streamId = generateId();
          // Create a resumable stream from the SSE stream
          const streamContext = createResumableStreamContext({
            waitUntil: after,
          });
          await streamContext.createNewResumableStream(streamId, () => stream);

          // Update the chat with the active stream ID
          await authDataService.updateChat({
            id,
            activeStreamId: streamId,
          });
        } catch (e) {
          console.error("Failed to setup resumable stream", e);
        }
      },
    });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
