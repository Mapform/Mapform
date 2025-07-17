"server-only";

import { db } from "@mapform/db";
import { chats, messages } from "@mapform/db/schema";
import { createMessagesSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";

export const createMessages = (authClient: UserAuthClient) =>
  authClient
    .schema(createMessagesSchema)
    .action(
      async ({
        parsedInput: { messages: insertMessages, chatId },
        ctx: { user },
      }) => {
        const chat = await db.query.chats.findFirst({
          where: eq(chats.id, chatId),
        });

        if (!chat) {
          throw new Error("Chat not found");
        }

        if (chat.userId !== user.id) {
          throw new Error("User cannot create messages for this chat");
        }

        const newMessages = await db
          .insert(messages)
          .values(
            insertMessages.map((m) => ({
              ...m,
              chatId,
              userId: user.id,
            })),
          )
          .returning();

        return newMessages;
      },
    );
