"server-only";

import { chats } from "@mapform/db/schema";
import { and, desc, eq } from "@mapform/db/utils";
import { listChatsSchema } from "./schema";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const listChats = (authClient: UserAuthClient) =>
  authClient
    .schema(listChatsSchema)
    .action(async ({ parsedInput: { projectId }, ctx: { user, db } }) => {
      return db.query.chats.findMany({
        where: and(
          eq(chats.userId, user.id),
          projectId ? eq(chats.projectId, projectId) : undefined,
        ),
        orderBy: [desc(chats.createdAt)],
      });
    });

export type ListChats = UnwrapReturn<typeof listChats>;
