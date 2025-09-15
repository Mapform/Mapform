import { tool } from "ai";
import { z } from "zod";
import { LinkupClient, type TextSearchResult } from "linkup-sdk";
import { env } from "~/env";

const client = new LinkupClient({
  apiKey: env.LINKUP_API_KEY,
});

export const webSearch = tool({
  description:
    "Search the web to find information for trip planning, restaurant recommendations, etc.",
  inputSchema: z.object({
    query: z.string().min(1).max(100).describe("The search query"),
  }),
  execute: async ({ query }) => webSearchFunc(query),
});

async function webSearchFunc(query: string) {
  const { results } = await client
    .search({
      query,
      depth: "standard",
      outputType: "searchResults",
      includeImages: false,
    })
    .catch((error) => {
      console.error("Error in webSearchFunc: ", error);
      throw new Error("Failed to search the web");
    });

  console.debug("webSearchFunc results: ", results);

  return (results as TextSearchResult[]).map((result) => ({
    name: result.name,
    url: result.url,
    content: result.content.slice(0, 1000),
  }));
}

export type WebSearchResponse = Awaited<ReturnType<typeof webSearchFunc>>;
