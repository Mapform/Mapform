"server-only";

import { aiTokenUsage } from "@mapform/db/schema";
import { and, eq } from "@mapform/db/utils";
import type { PublicClient, UserAuthClient } from "../../../lib/types";
import { z } from "zod";

const schema = z.object({
  workspaceSlug: z.string().min(1),
  day: z.string().optional(), // ISO date; defaults to today (UTC)
});

export const getAiTokenUsage = (authClient: UserAuthClient | PublicClient) =>
  authClient
    .schema(schema)
    .action(async ({ parsedInput: { workspaceSlug, day }, ctx }) => {
      if (
        ctx.authType === "user" &&
        !ctx.userAccess.workspace.checkAccessBySlug(workspaceSlug)
      ) {
        throw new Error("Unauthorized");
      }

      const today = day ? new Date(day) : new Date();
      const todayDateStr = `${today.getUTCFullYear().toString().padStart(4, "0")}-${(
        today.getUTCMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${today.getUTCDate().toString().padStart(2, "0")}`;

      const [row] = await ctx.db
        .select()
        .from(aiTokenUsage)
        .where(
          and(
            eq(aiTokenUsage.workspaceSlug, workspaceSlug),
            eq(aiTokenUsage.day, todayDateStr),
          ),
        );

      return row ?? { workspaceSlug, day: todayDateStr, tokensUsed: 0 };
    });
