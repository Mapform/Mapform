import { tool } from "ai";
import { z } from "zod";
import { authClient } from "~/lib/safe-action";
import type { AIResultLocation } from "~/lib/types";

export const findInternalFeatures = tool({
  description:
    "Searches for internal features (cities, landmarks, restaurants, etc.) that the user has saved in their workspace.",
  inputSchema: z.object({
    question: z.string().describe("the users question"),
  }),
  execute: async ({ question }) => _findInternalFeatures(question),
});

async function _findInternalFeatures(question: string) {
  const results = await authClient.searchRows({
    query: question,
    type: "workspace",
    workspaceSlug: "acme",
  });

  return (results?.data?.map((row) => ({
    id: row.id,
    name: row.name || undefined,
    coordinates: row.center.coordinates as [number, number],
    source: "mapform",
  })) || []) satisfies AIResultLocation[];
}

export type GetInformationResponse = Awaited<
  ReturnType<typeof _findInternalFeatures>
>;
