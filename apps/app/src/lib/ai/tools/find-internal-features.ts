import { tool } from "ai";
import { z } from "zod";
import { authDataService } from "~/lib/safe-action";
import type { AIResultLocation } from "~/lib/types";

export const findRawInternalFeatures = tool({
  description:
    "Searches for internal features (cities, landmarks, restaurants, etc.) that the user has saved in their workspace.",
  inputSchema: z.object({
    question: z.string().describe("the users question"),
    projectIds: z
      .array(z.string())
      .optional()
      .describe(
        "The internal project ids to search in. If not provided, all projects will be searched.",
      ),
  }),
  execute: async ({ question, projectIds }) =>
    _findRawInternalFeatures(question, projectIds),
});

async function _findRawInternalFeatures(
  question: string,
  projectIds?: string[] | null,
) {
  const results = projectIds
    ? await authDataService.searchRows({
        query: question,
        type: "project",
        projectIds,
      })
    : await authDataService.searchRows({
        query: question,
        type: "workspace",
        workspaceSlug: "acme",
      });

  const x = (results?.data?.map((row) => ({
    id: row.id,
    name: row.name || undefined,
    latitude: row.center.coordinates[0]!,
    longitude: row.center.coordinates[1]!,
    description: row.description || undefined,
    source: "mapform",
  })) || []) satisfies AIResultLocation[];
  console.debug("findRawInternalFeatures x: ", x);
  return x;
}

export type GetInformationResponse = Awaited<
  ReturnType<typeof _findRawInternalFeatures>
>;
