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
        console.log("insertMessages", insertMessages);

        const chat = await db.query.chats.findFirst({
          where: eq(chats.id, chatId),
          with: {
            messages: true,
          },
        });

        console.log("chat", chat);

        if (!chat) {
          throw new Error("Chat not found");
        }

        if (chat.userId !== user.id) {
          throw new Error("User cannot create messages for this chat");
        }

        // Filter out messages that already exist
        const newMessages = insertMessages.filter(
          (m) => !chat.messages.some((em) => em.id === m.id),
        );

        console.log("newMessages", newMessages);

        return db
          .insert(messages)
          .values(
            newMessages.map((m) => ({
              ...m,
              chatId,
              userId: user.id,
            })),
          )
          .returning();
      },
    );
