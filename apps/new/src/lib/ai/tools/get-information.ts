import { tool } from "ai";
import { z } from "zod";
import { authClient } from "~/lib/safe-action";
import type { AIResultLocation } from "~/lib/types";

export const getInformation = tool({
  description: "Get information from your knowledge base to answer questions.",
  inputSchema: z.object({
    question: z.string().describe("the users question"),
  }),
  execute: async ({ question }) => _getInformation(question),
});

async function _getInformation(question: string) {
  const results = await authClient.searchRows({
    query: question,
    type: "workspace",
    workspaceSlug: "acme",
  });

  return (results?.data?.map((row) => ({
    id: row.id,
    name: row.name || undefined,
    coordinates: row.center.coordinates as [number, number],
  })) || []) satisfies AIResultLocation[];
}

export type GetInformationResponse = Awaited<
  ReturnType<typeof _getInformation>
>;
