import { tool } from "ai";
import { z } from "zod";
import { authDataService } from "~/lib/safe-action";
import type { AIResultLocation } from "~/lib/types";

export const findRawInternalFeatures = tool({
  description:
    "Searches for internal features (cities, landmarks, restaurants, etc.) that the user has saved in their workspace.",
  inputSchema: z.object({
    question: z.string().describe("the users question"),
  }),
  execute: async ({ question }) => _findRawInternalFeatures(question),
});

async function _findRawInternalFeatures(question: string) {
  const results = await authDataService.searchRows({
    query: question,
    type: "workspace",
    workspaceSlug: "acme",
  });

  return (results?.data?.map((row) => ({
    id: row.id,
    name: row.name || undefined,
    latitude: row.center.coordinates[0]!,
    longitude: row.center.coordinates[1]!,
    source: "mapform",
  })) || []) satisfies AIResultLocation[];
}

export type GetInformationResponse = Awaited<
  ReturnType<typeof _findRawInternalFeatures>
>;
