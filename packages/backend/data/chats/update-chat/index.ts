"server-only";

import { chats, projects } from "@mapform/db/schema";
import { updateChatSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { and, eq } from "@mapform/db/utils";

export const updateChat = (authClient: UserAuthClient) =>
  authClient
    .schema(updateChatSchema)
    .action(
      async ({
        parsedInput: { id, title, activeStreamId },
        ctx: { user, db },
      }) => {
        const chat = await db.query.chats.findFirst({
          where: eq(chats.id, id),
          with: {
            project: true,
          },
        });

        if (!chat) {
          throw new Error("Chat not found");
        }

        if (chat.userId !== user.id) {
          throw new Error("User cannot delete this chat");
        }

        const [updatedChat] = await db
          .update(chats)
          .set({ title, activeStreamId })
          .where(eq(chats.id, id))
          .returning();

        return updatedChat;
      },
    );
