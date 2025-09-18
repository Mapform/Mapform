"server-only";

import { sql } from "@mapform/db";
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
        ctx: { user, db },
      }) => {
        const chat = await db.query.chats.findFirst({
          where: eq(chats.id, chatId),
          with: {
            messages: true,
          },
        });

        if (!chat) {
          throw new Error("Chat not found");
        }

        if (chat.userId !== user.id) {
          throw new Error("User cannot create messages for this chat");
        }

        const values = insertMessages.map((m) => ({
          ...m,
          chatId,
          userId: user.id,
        }));

        return db
          .insert(messages)
          .values(values)
          .onConflictDoUpdate({
            target: [messages.id],
            set: {
              // upsert many: https://github.com/drizzle-team/drizzle-orm/issues/1728#issuecomment-1880198186
              parts: sql`excluded.parts`,
            },
          })
          .returning();
      },
    );
