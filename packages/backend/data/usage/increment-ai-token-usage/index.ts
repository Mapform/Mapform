"server-only";

import { aiTokenUsage } from "@mapform/db/schema";
import { sql } from "@mapform/db/utils";
import type { UserAuthClient } from "../../../lib/types";
import { z } from "zod";

const schema = z.object({
  workspaceSlug: z.string().min(1),
  tokens: z.number().int().min(0),
});

export const incrementAiTokenUsage = (authClient: UserAuthClient) =>
  authClient
    .schema(schema)
    .action(async ({ parsedInput: { workspaceSlug, tokens }, ctx }) => {
      if (!ctx.userAccess.workspace.checkAccessBySlug(workspaceSlug)) {
        throw new Error("Unauthorized");
      }

      const now = new Date();
      const todayDateStr = `${now.getUTCFullYear().toString().padStart(4, "0")}-${(
        now.getUTCMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${now.getUTCDate().toString().padStart(2, "0")}`;

      // Upsert: insert row or increment existing
      const result = await ctx.db
        .insert(aiTokenUsage)
        .values({ workspaceSlug, day: todayDateStr, tokensUsed: tokens })
        .onConflictDoUpdate({
          target: [aiTokenUsage.workspaceSlug, aiTokenUsage.day],
          set: {
            tokensUsed: sql`${aiTokenUsage.tokensUsed} + ${tokens}`,
            updatedAt: new Date(),
          },
        })
        .returning();

      return result[0];
    });
