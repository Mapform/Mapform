"server-only";

import { db } from "@mapform/db";
import { chats } from "@mapform/db/schema";
import { deleteChatSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";

export const deleteChat = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteChatSchema)
    .action(async ({ parsedInput: { id }, ctx: { user } }) => {
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

      await db.delete(chats).where(eq(chats.id, id));

      return id;
    });
