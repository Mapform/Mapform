"server-only";

import { chats } from "@mapform/db/schema";
import { and, eq } from "@mapform/db/utils";
import { getChatSchema } from "./schema";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const getChat = (authClient: UserAuthClient) =>
  authClient
    .schema(getChatSchema)
    .action(async ({ parsedInput: { id }, ctx: { user, db } }) => {
      const chat = await db.query.chats.findFirst({
        where: and(eq(chats.id, id), eq(chats.userId, user.id)),
      });

      return chat;
    });

export type GetChat = UnwrapReturn<typeof getChat>;
