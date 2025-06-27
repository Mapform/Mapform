"server-only";

import { db, sql } from "@mapform/db";
import { projects, rows } from "@mapform/db/schema";
import { searchRowsSchema } from "./schema";
import type { UnwrapReturn, UserAuthClient } from "../../../lib/types";
import { cosineDistance, desc, eq } from "@mapform/db/utils";
import { openai } from "../../../clients/openai";

export const searchRows = (authClient: UserAuthClient) =>
  authClient
    .schema(searchRowsSchema)
    .action(
      async ({ parsedInput: { query, projectId }, ctx: { userAccess } }) => {
        const project = await db.query.projects.findFirst({
          where: eq(projects.id, projectId),
        });

        if (!project) {
          throw new Error("Project not found");
        }

        if (!userAccess.teamspace.checkAccessById(project.teamspaceId)) {
          throw new Error("You are not a member of this project");
        }

        console.log(22222, query);

        const response = await openai.embeddings.create({
          input: [query],
          model: "text-embedding-3-small",
        });

        const embedding = response.data[0]?.embedding;

        if (!embedding) {
          throw new Error("No embedding generated");
        }

        const similarity = sql<number>`1 - (${cosineDistance(rows.embedding, embedding)})`;

        const rowResults = await db.query.rows.findMany({
          where: sql`${similarity} > 0.5`,
          orderBy: [desc(similarity)],
        });

        return rowResults;
      },
    );

export type SearchRows = UnwrapReturn<typeof searchRows>;
