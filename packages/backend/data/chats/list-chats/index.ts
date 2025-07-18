"server-only";

import { db } from "@mapform/db";
import { chats } from "@mapform/db/schema";
import { and, eq, isNull } from "@mapform/db/utils";
import { listChatsSchema } from "./schema";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const listChats = (authClient: UserAuthClient) =>
  authClient
    .schema(listChatsSchema)
    .action(async ({ parsedInput: { projectId }, ctx: { user } }) => {
      return db.query.chats.findMany({
        where: and(
          eq(chats.userId, user.id),
          projectId ? eq(chats.projectId, projectId) : isNull(chats.projectId),
        ),
      });
    });

export type ListChats = UnwrapReturn<typeof listChats>;
