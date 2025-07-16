"server-only";

import { db } from "@mapform/db";
import { chats } from "@mapform/db/schema";
import { createChatSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const createChat = (authClient: UserAuthClient) =>
  authClient
    .schema(createChatSchema)
    .action(async ({ parsedInput: { id, name }, ctx: { user } }) => {
      const [chat] = await db
        .insert(chats)
        .values({ title: name, userId: user.id, projectId: id })
        .returning();

      return chat;
    });
