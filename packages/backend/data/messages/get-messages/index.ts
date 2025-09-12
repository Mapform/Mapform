"server-only";

import { db } from "@mapform/db";
import { chats, messages } from "@mapform/db/schema";
import { and, asc, eq } from "@mapform/db/utils";
import { getMessagesSchema } from "./schema";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const getMessages = (authClient: UserAuthClient) =>
  authClient
    .schema(getMessagesSchema)
    .action(async ({ parsedInput: { chatId }, ctx: { user } }) => {
      const chat = await db.query.chats.findFirst({
        where: and(eq(chats.id, chatId), eq(chats.userId, user.id)),
        with: {
          messages: {
            orderBy: [asc(messages.createdAt)],
          },
        },
      });

      if (!chat) {
        throw new Error("Chat not found");
      }

      return chat.messages;
    });

export type GetMessages = UnwrapReturn<typeof getMessages>;
