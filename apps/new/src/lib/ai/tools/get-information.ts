import { tool } from "ai";
import { z } from "zod";
import { authClient } from "~/lib/safe-action";

export const getInformation = tool({
  description: "Get information from your knowledge base to answer questions.",
  inputSchema: z.object({
    question: z.string().describe("the users question"),
  }),
  execute: async ({ question }) => _getInformation(question),
});

function _getInformation(question: string) {
  return authClient.searchRows({
    query: question,
    type: "workspace",
    workspaceSlug: "acme",
  });
}

export type GetInformationResponse = Awaited<
  ReturnType<typeof _getInformation>
>;
